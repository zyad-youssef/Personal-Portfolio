"""
Intelligence Chatbot — Powered by Claude Opus 4.6
Supports: on-demand intelligence, live API data, and decision support.
"""

import os
import sys
import json
import time
import threading
from datetime import datetime
from typing import Iterator

import anthropic
from dotenv import load_dotenv
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from rich.text import Text
from rich.table import Table
from rich.live import Live
from rich.spinner import Spinner
from rich import box

from tools import ALL_TOOLS, TOOL_EXECUTORS

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

console = Console()

SYSTEM_PROMPT = """You are an elite intelligence analyst and decision-support assistant powered by real-time data APIs.

Your capabilities:
- **Weather Intelligence**: Live conditions, forecasts, and operational advisories
- **Market Intelligence**: Real-time stock, crypto, and forex data with trend analysis
- **News Intelligence**: Current headlines and event analysis across any topic
- **Web Search**: On-demand factual lookups and research
- **Country Intelligence**: Geopolitical, economic, and demographic data on any nation
- **Financial Calculations**: ROI, compound interest, break-even, statistics, mortgage analysis

Your approach to every query:
1. **Gather data first** — Always use tools to pull live data before making assertions
2. **Show your sources** — Reference the data you retrieved
3. **Provide decision-relevant insights** — Don't just report data; explain what it means for the user's decision
4. **Quantify when possible** — Use numbers, percentages, and comparisons
5. **Flag uncertainty** — Be clear when data is limited or assumptions are made
6. **Recommend actions** — When appropriate, give a clear recommendation with reasoning

Be direct, analytical, and actionable. Think like a senior analyst who has 30 seconds to brief an executive."""


class IntelligenceChatbot:
    """Multi-turn chatbot with tool use and streaming."""

    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            console.print("[bold red]Error:[/] ANTHROPIC_API_KEY is not set.")
            console.print("Copy [cyan].env.example[/] to [cyan].env[/] and add your API key.")
            sys.exit(1)

        self.client = anthropic.Anthropic(api_key=api_key)
        self.messages: list[dict] = []
        self.turn_count = 0
        self.session_start = datetime.now()
        self._tool_results_this_turn: list[dict] = []

    # ─────────────────────────────────────────────────────────────────────
    # Public interface
    # ─────────────────────────────────────────────────────────────────────

    def chat(self, user_input: str) -> None:
        """Process one user turn, streaming the response."""
        self.turn_count += 1
        self._tool_results_this_turn = []

        self.messages.append({"role": "user", "content": user_input})

        # Agentic loop: keep running until no more tool calls
        while True:
            response_text = ""
            tool_calls = []
            stop_reason = None

            # ── Stream the response ──────────────────────────────────────
            console.print()
            with console.status("[dim]Thinking...[/dim]", spinner="dots"):
                # Brief pause to let the status show
                time.sleep(0.05)

            console.print(Panel(
                "",
                title="[bold cyan]Intelligence Assistant[/bold cyan]",
                border_style="cyan",
                padding=(0, 1),
            ), end="")

            # Stream
            response_text, tool_calls, stop_reason = self._stream_response()

            # ── Handle tool calls ────────────────────────────────────────
            if stop_reason == "tool_use" and tool_calls:
                tool_results = self._execute_tools(tool_calls)

                # Append assistant message (with tool_use blocks)
                self.messages.append({
                    "role": "assistant",
                    "content": self._build_assistant_content(response_text, tool_calls)
                })

                # Append tool results as user message
                self.messages.append({
                    "role": "user",
                    "content": tool_results
                })

                # Continue the loop — Claude will process the results
                continue

            else:
                # Natural end — append final assistant message
                self.messages.append({
                    "role": "assistant",
                    "content": response_text
                })
                break

        # Show tool summary if tools were used
        if self._tool_results_this_turn:
            self._print_tool_summary()

    def reset(self) -> None:
        """Clear conversation history."""
        self.messages = []
        self.turn_count = 0
        self.session_start = datetime.now()
        console.print("[dim]Conversation cleared.[/dim]")

    def show_status(self) -> None:
        """Print session status."""
        table = Table(box=box.SIMPLE, show_header=False)
        table.add_column("Key", style="dim")
        table.add_column("Value", style="bold")

        duration = datetime.now() - self.session_start
        minutes = int(duration.total_seconds() / 60)

        table.add_row("Session duration", f"{minutes}m")
        table.add_row("Turns", str(self.turn_count))
        table.add_row("Messages in context", str(len(self.messages)))
        table.add_row("Available tools", str(len(ALL_TOOLS)))

        api_status = []
        if os.getenv("OPENWEATHER_API_KEY"):
            api_status.append("Weather ✓")
        if os.getenv("ALPHA_VANTAGE_API_KEY"):
            api_status.append("Finance ✓")
        if os.getenv("NEWS_API_KEY"):
            api_status.append("News ✓")
        if not api_status:
            api_status = ["All in demo mode — see .env.example"]

        table.add_row("Live APIs", ", ".join(api_status))

        console.print(Panel(table, title="[bold]Session Status[/bold]", border_style="dim"))

    # ─────────────────────────────────────────────────────────────────────
    # Internal methods
    # ─────────────────────────────────────────────────────────────────────

    def _stream_response(self) -> tuple[str, list[dict], str]:
        """Stream the API response, printing text deltas in real time."""
        response_text_parts = []
        tool_calls = []
        stop_reason = "end_turn"
        current_tool = None
        current_tool_input_json = ""
        in_thinking = False

        try:
            with self.client.messages.stream(
                model="claude-opus-4-6",
                max_tokens=8192,
                thinking={"type": "adaptive"},
                system=SYSTEM_PROMPT,
                tools=ALL_TOOLS,
                messages=self.messages,
            ) as stream:
                for event in stream:
                    etype = event.type

                    if etype == "content_block_start":
                        block = event.content_block
                        if block.type == "thinking":
                            in_thinking = True
                        elif block.type == "text":
                            in_thinking = False
                        elif block.type == "tool_use":
                            in_thinking = False
                            current_tool = {
                                "id": block.id,
                                "name": block.name,
                                "input": {}
                            }
                            current_tool_input_json = ""
                            console.print(
                                f"\n[dim]🔧 Calling [bold]{block.name}[/bold]...[/dim]",
                            )

                    elif etype == "content_block_delta":
                        delta = event.delta
                        if hasattr(delta, "text") and delta.type == "text_delta" and not in_thinking:
                            console.print(delta.text, end="", markup=False)
                            response_text_parts.append(delta.text)
                        elif hasattr(delta, "partial_json") and delta.type == "input_json_delta":
                            current_tool_input_json += delta.partial_json

                    elif etype == "content_block_stop":
                        if current_tool is not None:
                            try:
                                current_tool["input"] = json.loads(current_tool_input_json) \
                                    if current_tool_input_json else {}
                            except json.JSONDecodeError:
                                current_tool["input"] = {}
                            tool_calls.append(current_tool)
                            current_tool = None
                            current_tool_input_json = ""

                    elif etype == "message_delta":
                        if hasattr(event, "delta") and hasattr(event.delta, "stop_reason"):
                            stop_reason = event.delta.stop_reason or "end_turn"

        except anthropic.RateLimitError:
            console.print("\n[yellow]Rate limited — please wait a moment.[/yellow]")
            raise
        except anthropic.AuthenticationError:
            console.print("\n[red]Authentication failed. Check ANTHROPIC_API_KEY.[/red]")
            raise
        except anthropic.APIConnectionError:
            console.print("\n[red]Connection error. Check your internet connection.[/red]")
            raise

        console.print()  # newline after streaming
        return "".join(response_text_parts), tool_calls, stop_reason

    def _execute_tools(self, tool_calls: list[dict]) -> list[dict]:
        """Execute all requested tool calls and return tool_result blocks."""
        results = []

        for call in tool_calls:
            name = call["name"]
            tool_input = call["input"]
            tool_id = call["id"]

            executor = TOOL_EXECUTORS.get(name)
            if not executor:
                result_text = f"Tool '{name}' not found."
                is_error = True
            else:
                try:
                    with console.status(
                        f"[dim]  Fetching data from [bold]{name}[/bold]...[/dim]",
                        spinner="dots2"
                    ):
                        result_text = executor(tool_input)
                    is_error = False
                    # Store for summary display
                    self._tool_results_this_turn.append({
                        "tool": name,
                        "input": tool_input,
                        "result_preview": result_text[:300]
                    })
                except Exception as e:
                    result_text = f"Tool execution error: {str(e)}"
                    is_error = True

            results.append({
                "type": "tool_result",
                "tool_use_id": tool_id,
                "content": result_text,
                "is_error": is_error
            })

        return results

    def _build_assistant_content(self, text: str, tool_calls: list[dict]) -> list[dict]:
        """Build the assistant content array with text and tool_use blocks."""
        content = []
        if text:
            content.append({"type": "text", "text": text})
        for call in tool_calls:
            content.append({
                "type": "tool_use",
                "id": call["id"],
                "name": call["name"],
                "input": call["input"]
            })
        return content

    def _print_tool_summary(self) -> None:
        """Print a compact summary of which tools were called."""
        tool_names = [t["tool"] for t in self._tool_results_this_turn]
        if not tool_names:
            return
        tools_str = " · ".join(f"[cyan]{n}[/cyan]" for n in tool_names)
        console.print(f"\n[dim]Data sources used: {tools_str}[/dim]")


# ─────────────────────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────────────────────

HELP_TEXT = """
[bold]Commands:[/bold]
  [cyan]/help[/cyan]      Show this help
  [cyan]/status[/cyan]    Show session status and API connections
  [cyan]/clear[/cyan]     Clear conversation history (start fresh)
  [cyan]/tools[/cyan]     List available tools
  [cyan]/exit[/cyan]      Quit

[bold]Example queries:[/bold]
  "What's the weather in Tokyo? Should I pack an umbrella for next week?"
  "Compare Apple and Microsoft stock performance today"
  "What are the latest AI regulation news? How might it affect my startup?"
  "Calculate the ROI on a $50k investment returning $75k over 3 years"
  "Tell me about Germany's market — I want to expand there"
  "Search for the current federal funds rate and explain its impact"
"""

TOOLS_TEXT = """
[bold]Available Tools:[/bold]

  🌤️  [cyan]get_weather[/cyan]
      Live weather conditions, 5-day forecast, and outdoor/travel advisories
      Requires: OPENWEATHER_API_KEY (demo mode without it)

  📈  [cyan]get_market_data[/cyan]
      Real-time stocks, crypto, and forex prices with trend context
      Requires: ALPHA_VANTAGE_API_KEY (demo mode without it)

  📰  [cyan]get_news[/cyan]
      Latest headlines on any topic with source and time
      Requires: NEWS_API_KEY (demo mode without it)

  🔍  [cyan]web_search[/cyan]
      DuckDuckGo instant answers for facts and definitions
      No API key required

  🧮  [cyan]calculate[/cyan]
      Arithmetic, compound interest, ROI, break-even, statistics, mortgage
      No API key required

  🌍  [cyan]get_country_info[/cyan]
      Country demographics, economy, geography, and market context
      No API key required (REST Countries API)
"""


def print_banner():
    banner = Text()
    banner.append("  Intelligence Chatbot\n", style="bold cyan")
    banner.append("  Powered by Claude Opus 4.6 + Live APIs\n", style="dim")
    console.print(Panel(
        banner,
        border_style="cyan",
        padding=(0, 1),
    ))
    console.print("[dim]Type [cyan]/help[/cyan] for commands, or just ask anything.[/dim]\n")


def print_tool_list():
    console.print(Markdown(TOOLS_TEXT.replace("[bold]", "**").replace("[/bold]", "**")
                           .replace("[cyan]", "`").replace("[/cyan]", "`")))


def main():
    print_banner()

    bot = IntelligenceChatbot()

    while True:
        try:
            console.print("[bold green]You:[/bold green] ", end="")
            user_input = input().strip()
        except (EOFError, KeyboardInterrupt):
            console.print("\n[dim]Goodbye.[/dim]")
            break

        if not user_input:
            continue

        # Commands
        lower = user_input.lower()
        if lower in ("/exit", "/quit", "exit", "quit"):
            console.print("[dim]Goodbye.[/dim]")
            break
        elif lower == "/help":
            console.print(Markdown(HELP_TEXT.replace("[bold]", "**").replace("[/bold]", "**")
                                   .replace("[cyan]", "`").replace("[/cyan]", "`")))
            continue
        elif lower == "/clear":
            bot.reset()
            continue
        elif lower == "/status":
            bot.show_status()
            continue
        elif lower == "/tools":
            console.print(TOOLS_TEXT)
            continue

        # Regular chat
        try:
            bot.chat(user_input)
        except anthropic.RateLimitError:
            console.print("[yellow]Rate limited. Wait a few seconds and try again.[/yellow]")
        except (anthropic.AuthenticationError, anthropic.APIConnectionError):
            pass  # Already printed inside chat()
        except KeyboardInterrupt:
            console.print("\n[dim]Interrupted.[/dim]")
        except Exception as e:
            console.print(f"[red]Unexpected error:[/red] {e}")

        console.print()


if __name__ == "__main__":
    main()
