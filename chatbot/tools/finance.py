import os
import httpx
import json
from datetime import datetime

get_market_data_tool = {
    "name": "get_market_data",
    "description": (
        "Get real-time or recent stock/crypto/forex market data including price, "
        "change, volume, and key financial metrics. Provides decision context for "
        "investment analysis, trend identification, and market conditions."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "symbol": {
                "type": "string",
                "description": "Ticker symbol (e.g. 'AAPL', 'GOOGL', 'BTC', 'EUR/USD')"
            },
            "asset_type": {
                "type": "string",
                "enum": ["stock", "crypto", "forex"],
                "description": "Type of asset. Default: stock"
            }
        },
        "required": ["symbol"]
    }
}


def execute_get_market_data(inputs: dict) -> str:
    symbol = inputs["symbol"].upper()
    asset_type = inputs.get("asset_type", "stock")
    api_key = os.getenv("ALPHA_VANTAGE_API_KEY")

    if not api_key:
        return _mock_market_data(symbol, asset_type)

    try:
        with httpx.Client(timeout=15) as client:
            if asset_type == "stock":
                return _fetch_stock(client, symbol, api_key)
            elif asset_type == "crypto":
                return _fetch_crypto(client, symbol, api_key)
            elif asset_type == "forex":
                return _fetch_forex(client, symbol, api_key)
            else:
                return _fetch_stock(client, symbol, api_key)
    except Exception as e:
        return f"Could not fetch market data for {symbol}: {str(e)}"


def _fetch_stock(client, symbol, api_key):
    resp = client.get(
        "https://www.alphavantage.co/query",
        params={
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": api_key
        }
    )
    resp.raise_for_status()
    data = resp.json()

    if "Global Quote" not in data or not data["Global Quote"]:
        return f"No data found for symbol '{symbol}'. Check the ticker and try again."

    q = data["Global Quote"]
    price = float(q.get("05. price", 0))
    change = float(q.get("09. change", 0))
    change_pct = q.get("10. change percent", "0%").replace("%", "")
    change_pct_f = float(change_pct) if change_pct else 0
    volume = int(q.get("06. volume", 0))
    prev_close = float(q.get("08. previous close", 0))
    high = float(q.get("03. high", 0))
    low = float(q.get("04. low", 0))
    latest_day = q.get("07. latest trading day", "N/A")

    direction = "▲" if change >= 0 else "▼"
    context = _stock_decision_context(change_pct_f, price, high, low, volume)

    return (
        f"Stock: {symbol} (as of {latest_day})\n"
        f"  Price: ${price:.2f}\n"
        f"  Change: {direction} ${abs(change):.2f} ({change_pct_f:+.2f}%)\n"
        f"  Volume: {volume:,}\n"
        f"  Day Range: ${low:.2f} – ${high:.2f}\n"
        f"  Prev Close: ${prev_close:.2f}\n\n"
        f"Decision Context:\n{context}"
    )


def _fetch_crypto(client, symbol, api_key):
    # Alpha Vantage crypto endpoint
    resp = client.get(
        "https://www.alphavantage.co/query",
        params={
            "function": "CURRENCY_EXCHANGE_RATE",
            "from_currency": symbol,
            "to_currency": "USD",
            "apikey": api_key
        }
    )
    resp.raise_for_status()
    data = resp.json()

    if "Realtime Currency Exchange Rate" not in data:
        return f"No crypto data found for '{symbol}'."

    rate = data["Realtime Currency Exchange Rate"]
    price = float(rate.get("5. Exchange Rate", 0))
    bid = float(rate.get("8. Bid Price", 0))
    ask = float(rate.get("9. Ask Price", 0))
    last_refreshed = rate.get("6. Last Refreshed", "N/A")

    spread_pct = ((ask - bid) / price * 100) if price > 0 else 0

    return (
        f"Crypto: {symbol}/USD (updated {last_refreshed})\n"
        f"  Price: ${price:,.4f}\n"
        f"  Bid: ${bid:,.4f} | Ask: ${ask:,.4f}\n"
        f"  Spread: {spread_pct:.3f}%\n\n"
        f"Decision Context:\n"
        f"  {'✅ Tight spread — liquid market' if spread_pct < 0.1 else '⚠️ Wide spread — lower liquidity'}\n"
        f"  📊 Live exchange rate from Alpha Vantage"
    )


def _fetch_forex(client, symbol, api_key):
    parts = symbol.replace("-", "/").split("/")
    from_cur = parts[0] if len(parts) >= 2 else symbol
    to_cur = parts[1] if len(parts) >= 2 else "USD"

    resp = client.get(
        "https://www.alphavantage.co/query",
        params={
            "function": "CURRENCY_EXCHANGE_RATE",
            "from_currency": from_cur,
            "to_currency": to_cur,
            "apikey": api_key
        }
    )
    resp.raise_for_status()
    data = resp.json()

    if "Realtime Currency Exchange Rate" not in data:
        return f"No forex data for '{symbol}'."

    rate = data["Realtime Currency Exchange Rate"]
    price = float(rate.get("5. Exchange Rate", 0))
    last_refreshed = rate.get("6. Last Refreshed", "N/A")

    return (
        f"Forex: {from_cur}/{to_cur} (updated {last_refreshed})\n"
        f"  Rate: {price:.5f}\n\n"
        f"Decision Context:\n"
        f"  📊 1 {from_cur} = {price:.5f} {to_cur}\n"
        f"  Use this rate for currency conversion and international transactions."
    )


def _stock_decision_context(change_pct, price, high, low, volume):
    lines = []

    if change_pct >= 5:
        lines.append("  📈 Strong upward momentum — significant single-day gain")
    elif change_pct >= 2:
        lines.append("  ↗️  Positive momentum — moderate gain")
    elif change_pct <= -5:
        lines.append("  📉 Sharp decline — significant single-day loss, review position")
    elif change_pct <= -2:
        lines.append("  ↘️  Negative momentum — moderate loss")
    else:
        lines.append("  ↔️  Relatively flat — minimal price movement today")

    day_range = high - low
    range_pct = (day_range / low * 100) if low > 0 else 0
    if range_pct > 5:
        lines.append(f"  ⚠️  High volatility: {range_pct:.1f}% intraday range")
    else:
        lines.append(f"  ✅ Low volatility: {range_pct:.1f}% intraday range")

    if volume > 10_000_000:
        lines.append(f"  📊 High volume ({volume:,}) — strong market interest")
    elif volume > 1_000_000:
        lines.append(f"  📊 Moderate volume ({volume:,})")
    else:
        lines.append(f"  📊 Low volume ({volume:,}) — limited trading activity")

    return "\n".join(lines)


def _mock_market_data(symbol, asset_type):
    if asset_type == "crypto":
        return (
            f"Crypto: {symbol}/USD (demo — set ALPHA_VANTAGE_API_KEY for live data)\n"
            f"  Price: $42,850.00\n"
            f"  Bid: $42,840.00 | Ask: $42,860.00\n"
            f"  Spread: 0.047%\n\n"
            f"Decision Context:\n"
            f"  ✅ Tight spread — liquid market\n"
            f"  📊 Demo data only"
        )
    return (
        f"Stock: {symbol} (demo — set ALPHA_VANTAGE_API_KEY for live data)\n"
        f"  Price: $185.50\n"
        f"  Change: ▲ $2.30 (+1.26%)\n"
        f"  Volume: 45,230,100\n"
        f"  Day Range: $183.20 – $186.80\n"
        f"  Prev Close: $183.20\n\n"
        f"Decision Context:\n"
        f"  ↗️  Positive momentum — moderate gain\n"
        f"  ✅ Low volatility: 1.9% intraday range\n"
        f"  📊 High volume — strong market interest"
    )
