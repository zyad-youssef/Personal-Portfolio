import os
import httpx
import json
from datetime import datetime

get_weather_tool = {
    "name": "get_weather",
    "description": (
        "Get current weather conditions and a 5-day forecast for any city. "
        "Returns temperature, humidity, wind speed, weather description, "
        "and decision-relevant context (e.g., good for outdoor events, travel advisories)."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {
                "type": "string",
                "description": "City name, e.g. 'New York', 'London', 'Tokyo'"
            },
            "units": {
                "type": "string",
                "enum": ["metric", "imperial"],
                "description": "Temperature units: 'metric' (Celsius) or 'imperial' (Fahrenheit). Default: metric"
            }
        },
        "required": ["city"]
    }
}


def execute_get_weather(inputs: dict) -> str:
    city = inputs["city"]
    units = inputs.get("units", "metric")
    api_key = os.getenv("OPENWEATHER_API_KEY")

    unit_symbol = "°C" if units == "metric" else "°F"
    speed_unit = "m/s" if units == "metric" else "mph"

    if not api_key:
        return _mock_weather(city, units, unit_symbol, speed_unit)

    try:
        with httpx.Client(timeout=10) as client:
            # Current weather
            current_resp = client.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={"q": city, "appid": api_key, "units": units}
            )
            current_resp.raise_for_status()
            current = current_resp.json()

            # 5-day forecast
            forecast_resp = client.get(
                "https://api.openweathermap.org/data/2.5/forecast",
                params={"q": city, "appid": api_key, "units": units, "cnt": 5}
            )
            forecast_resp.raise_for_status()
            forecast = forecast_resp.json()

        temp = current["main"]["temp"]
        feels_like = current["main"]["feels_like"]
        humidity = current["main"]["humidity"]
        wind_speed = current["wind"]["speed"]
        description = current["weather"][0]["description"].capitalize()
        visibility = current.get("visibility", 0) / 1000

        forecast_lines = []
        for item in forecast["list"]:
            dt = datetime.fromtimestamp(item["dt"]).strftime("%a %b %d %H:%M")
            t = item["main"]["temp"]
            desc = item["weather"][0]["description"]
            forecast_lines.append(f"  {dt}: {t}{unit_symbol}, {desc}")
        forecast_str = "\n".join(forecast_lines)

        # Decision context
        context = _weather_decision_context(temp, units, wind_speed, speed_unit, description)

        return (
            f"Weather in {city}:\n"
            f"  Condition: {description}\n"
            f"  Temperature: {temp}{unit_symbol} (feels like {feels_like}{unit_symbol})\n"
            f"  Humidity: {humidity}%\n"
            f"  Wind: {wind_speed} {speed_unit}\n"
            f"  Visibility: {visibility:.1f} km\n\n"
            f"5-Step Forecast:\n{forecast_str}\n\n"
            f"Decision Context:\n{context}"
        )

    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return f"City '{city}' not found. Please check the city name."
        return f"Weather API error: {e.response.status_code}"
    except Exception as e:
        return f"Could not fetch weather data: {str(e)}"


def _weather_decision_context(temp, units, wind_speed, speed_unit, description):
    lines = []
    is_metric = units == "metric"

    # Temperature thresholds (metric)
    cold_thresh = 5 if is_metric else 41
    hot_thresh = 32 if is_metric else 90
    wind_thresh = 10 if is_metric else 22

    if temp < cold_thresh:
        lines.append("  ⚠️  Cold conditions — wear warm layers, limit outdoor exposure")
    elif temp > hot_thresh:
        lines.append("  ⚠️  Hot conditions — stay hydrated, seek shade")
    else:
        lines.append("  ✅ Comfortable temperature for outdoor activities")

    if wind_speed > wind_thresh:
        lines.append("  ⚠️  High winds — not ideal for outdoor events or light structures")

    desc_lower = description.lower()
    if any(w in desc_lower for w in ["rain", "drizzle", "shower"]):
        lines.append("  🌧️  Rain expected — bring an umbrella, delays likely for outdoor plans")
    elif any(w in desc_lower for w in ["storm", "thunder"]):
        lines.append("  ⛈️  Storm conditions — avoid outdoor activities, seek shelter")
    elif any(w in desc_lower for w in ["snow", "blizzard", "sleet"]):
        lines.append("  🌨️  Snow/ice — plan for travel delays, dangerous road conditions")
    elif any(w in desc_lower for w in ["clear", "sunny"]):
        lines.append("  ☀️  Clear skies — excellent for outdoor events and travel")
    elif "cloud" in desc_lower:
        lines.append("  ⛅ Cloudy but manageable — moderate conditions")

    return "\n".join(lines) if lines else "  Normal conditions"


def _mock_weather(city, units, unit_symbol, speed_unit):
    return (
        f"Weather in {city} (demo — set OPENWEATHER_API_KEY for live data):\n"
        f"  Condition: Partly cloudy\n"
        f"  Temperature: 18{unit_symbol} (feels like 16{unit_symbol})\n"
        f"  Humidity: 65%\n"
        f"  Wind: 5 {speed_unit}\n"
        f"  Visibility: 10.0 km\n\n"
        f"Decision Context:\n"
        f"  ✅ Comfortable temperature for outdoor activities\n"
        f"  ⛅ Cloudy but manageable — moderate conditions"
    )
