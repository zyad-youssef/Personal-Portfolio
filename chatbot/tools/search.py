import httpx
import json

web_search_tool = {
    "name": "web_search",
    "description": (
        "Search the web for information, facts, definitions, and current data. "
        "Uses DuckDuckGo's instant answer API — no API key required. "
        "Best for factual lookups, definitions, quick answers, and finding overviews "
        "of topics. For news, use get_news instead."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Search query, e.g. 'GDP of Germany 2024', 'Python asyncio tutorial'"
            }
        },
        "required": ["query"]
    }
}


def execute_web_search(inputs: dict) -> str:
    query = inputs["query"]

    try:
        with httpx.Client(timeout=10) as client:
            resp = client.get(
                "https://api.duckduckgo.com/",
                params={
                    "q": query,
                    "format": "json",
                    "no_html": "1",
                    "skip_disambig": "1"
                },
                headers={"User-Agent": "IntelligenceChatbot/1.0"}
            )
            resp.raise_for_status()
            data = resp.json()

        results = []

        # Abstract (main answer)
        abstract = data.get("AbstractText", "").strip()
        abstract_source = data.get("AbstractSource", "")
        abstract_url = data.get("AbstractURL", "")
        if abstract:
            results.append(f"Summary ({abstract_source}):\n{abstract}")
            if abstract_url:
                results.append(f"Source: {abstract_url}")
            results.append("")

        # Instant answer
        answer = data.get("Answer", "").strip()
        answer_type = data.get("AnswerType", "")
        if answer:
            results.append(f"Instant Answer ({answer_type}):\n{answer}\n")

        # Definition
        definition = data.get("Definition", "").strip()
        definition_source = data.get("DefinitionSource", "")
        if definition:
            results.append(f"Definition ({definition_source}):\n{definition}\n")

        # Related topics (top 5)
        related = data.get("RelatedTopics", [])
        if related:
            results.append("Related Topics:")
            count = 0
            for item in related:
                if count >= 5:
                    break
                if isinstance(item, dict) and "Text" in item:
                    text = item["Text"][:200]
                    url = item.get("FirstURL", "")
                    results.append(f"  • {text}")
                    if url:
                        results.append(f"    {url}")
                    count += 1
                elif isinstance(item, dict) and "Topics" in item:
                    # Sub-category
                    for sub in item.get("Topics", [])[:2]:
                        if count >= 5:
                            break
                        if isinstance(sub, dict) and "Text" in sub:
                            results.append(f"  • {sub['Text'][:200]}")
                            count += 1

        if not results:
            return (
                f"No direct answer found for '{query}'.\n"
                f"Try rephrasing as a factual question, or use get_news for current events."
            )

        return f"Search results for '{query}':\n\n" + "\n".join(results)

    except Exception as e:
        return f"Web search failed for '{query}': {str(e)}"
