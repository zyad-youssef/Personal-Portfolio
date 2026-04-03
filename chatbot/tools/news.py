import os
import httpx
from datetime import datetime, timezone

get_news_tool = {
    "name": "get_news",
    "description": (
        "Fetch the latest news headlines and summaries on any topic, company, or keyword. "
        "Returns top articles with source, publish time, and relevance context. "
        "Useful for staying current on market events, geopolitical developments, "
        "industry trends, and anything that might affect decisions."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Search query, e.g. 'AI regulation', 'Apple earnings', 'oil prices'"
            },
            "category": {
                "type": "string",
                "enum": ["general", "business", "technology", "science", "health", "sports", "entertainment"],
                "description": "News category filter. Default: general"
            },
            "max_articles": {
                "type": "integer",
                "description": "Number of articles to return (1–10). Default: 5"
            }
        },
        "required": ["query"]
    }
}


def execute_get_news(inputs: dict) -> str:
    query = inputs["query"]
    category = inputs.get("category", "general")
    max_articles = min(max(int(inputs.get("max_articles", 5)), 1), 10)
    api_key = os.getenv("NEWS_API_KEY")

    if not api_key:
        return _mock_news(query, max_articles)

    try:
        with httpx.Client(timeout=10) as client:
            resp = client.get(
                "https://newsapi.org/v2/everything",
                params={
                    "q": query,
                    "apiKey": api_key,
                    "pageSize": max_articles,
                    "sortBy": "publishedAt",
                    "language": "en"
                },
                headers={"User-Agent": "IntelligenceChatbot/1.0"}
            )
            resp.raise_for_status()
            data = resp.json()

        articles = data.get("articles", [])
        if not articles:
            return f"No recent news found for '{query}'. Try broader search terms."

        total = data.get("totalResults", 0)
        lines = [f"News for '{query}' ({total:,} total results, showing top {len(articles)}):\n"]

        for i, art in enumerate(articles, 1):
            title = art.get("title", "No title")
            source = art.get("source", {}).get("name", "Unknown")
            url = art.get("url", "")
            published = art.get("publishedAt", "")
            description = art.get("description", "") or ""

            # Format publish time as relative
            time_str = _format_time(published)

            lines.append(f"{i}. [{source}] {title}")
            lines.append(f"   Published: {time_str}")
            if description:
                # Truncate description
                desc = description[:200] + "..." if len(description) > 200 else description
                lines.append(f"   {desc}")
            lines.append(f"   {url}")
            lines.append("")

        return "\n".join(lines)

    except httpx.HTTPStatusError as e:
        if e.response.status_code == 401:
            return "News API key is invalid. Check your NEWS_API_KEY."
        return f"News API error: {e.response.status_code}"
    except Exception as e:
        return f"Could not fetch news: {str(e)}"


def _format_time(iso_str: str) -> str:
    if not iso_str:
        return "Unknown"
    try:
        dt = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        diff = now - dt
        hours = diff.total_seconds() / 3600
        if hours < 1:
            return f"{int(diff.total_seconds() / 60)} minutes ago"
        elif hours < 24:
            return f"{int(hours)} hours ago"
        else:
            return f"{int(hours / 24)} days ago"
    except Exception:
        return iso_str


def _mock_news(query, max_articles):
    return (
        f"News for '{query}' (demo — set NEWS_API_KEY for live headlines):\n\n"
        f"1. [Reuters] Markets Rally as Tech Stocks Lead Gains\n"
        f"   Published: 2 hours ago\n"
        f"   Major technology companies drove a broad market rally, with the S&P 500 gaining 1.2%...\n\n"
        f"2. [Bloomberg] Federal Reserve Signals Cautious Approach to Rate Decisions\n"
        f"   Published: 4 hours ago\n"
        f"   Fed officials indicated they will monitor economic data before making further policy changes...\n\n"
        f"3. [AP] Global Supply Chain Pressures Ease Amid Strong Logistics Data\n"
        f"   Published: 6 hours ago\n"
        f"   Freight costs and delivery times improve as shipping bottlenecks clear worldwide...\n\n"
        f"Set NEWS_API_KEY for real articles related to '{query}'."
    )
