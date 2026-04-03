import httpx

get_country_info_tool = {
    "name": "get_country_info",
    "description": (
        "Get comprehensive data about any country: population, GDP, capital, region, "
        "languages, currencies, area, and more. Uses the free REST Countries API — "
        "no key required. Useful for international business decisions, market analysis, "
        "geopolitical context, and travel planning."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "country": {
                "type": "string",
                "description": "Country name or ISO code, e.g. 'Germany', 'Japan', 'US', 'BR'"
            }
        },
        "required": ["country"]
    }
}


def execute_get_country_info(inputs: dict) -> str:
    country = inputs["country"].strip()

    try:
        with httpx.Client(timeout=10) as client:
            # Try by name first
            resp = client.get(
                f"https://restcountries.com/v3.1/name/{country}",
                params={"fullText": "false"}
            )
            if resp.status_code == 404:
                # Try by alpha code
                resp = client.get(f"https://restcountries.com/v3.1/alpha/{country}")
            resp.raise_for_status()
            data = resp.json()

        if not data:
            return f"No country data found for '{country}'."

        # Pick best match (exact name match preferred)
        c = data[0]
        if len(data) > 1:
            for item in data:
                names = item.get("name", {})
                if names.get("common", "").lower() == country.lower() or \
                   names.get("official", "").lower() == country.lower():
                    c = item
                    break

        name_common = c.get("name", {}).get("common", "N/A")
        name_official = c.get("name", {}).get("official", "N/A")
        capital = ", ".join(c.get("capital", ["N/A"]))
        region = c.get("region", "N/A")
        subregion = c.get("subregion", "N/A")
        population = c.get("population", 0)
        area = c.get("area", 0)

        # Languages
        languages = c.get("languages", {})
        lang_str = ", ".join(languages.values()) if languages else "N/A"

        # Currencies
        currencies = c.get("currencies", {})
        curr_parts = []
        for code, info in currencies.items():
            symbol = info.get("symbol", "")
            curr_name = info.get("name", code)
            curr_parts.append(f"{curr_name} ({code}{', ' + symbol if symbol else ''})")
        curr_str = ", ".join(curr_parts) if curr_parts else "N/A"

        # Timezones
        timezones = c.get("timezones", [])
        tz_str = ", ".join(timezones[:3])
        if len(timezones) > 3:
            tz_str += f" (+{len(timezones) - 3} more)"

        # Borders
        borders = c.get("borders", [])
        border_str = ", ".join(borders) if borders else "None (island or isolated)"

        # Calling codes
        idd = c.get("idd", {})
        calling_code = ""
        if idd:
            root = idd.get("root", "")
            suffixes = idd.get("suffixes", [""])
            calling_code = root + (suffixes[0] if suffixes else "")

        # GDP (not always available in REST Countries)
        gdp_info = ""
        gini = c.get("gini", {})
        if gini:
            year, value = next(iter(gini.items()))
            gdp_info = f"\n  Gini Index ({year}): {value}"

        # Internet TLD
        tlds = ", ".join(c.get("tld", []))

        # UN membership
        un_member = "Yes" if c.get("unMember") else "No"
        landlocked = "Yes" if c.get("landlocked") else "No"

        density = population / area if area > 0 else 0

        result = (
            f"Country: {name_common}\n"
            f"  Official Name: {name_official}\n"
            f"  Capital: {capital}\n"
            f"  Region: {subregion}, {region}\n"
            f"  Population: {population:,}\n"
            f"  Area: {area:,.0f} km²\n"
            f"  Population Density: {density:.1f}/km²\n"
            f"  Languages: {lang_str}\n"
            f"  Currencies: {curr_str}\n"
            f"  Timezones: {tz_str}\n"
            f"  Calling Code: {calling_code}\n"
            f"  Internet TLD: {tlds}\n"
            f"  Bordering Countries: {border_str}\n"
            f"  Landlocked: {landlocked}\n"
            f"  UN Member: {un_member}"
            f"{gdp_info}\n\n"
            f"Decision Context:\n"
            f"{_country_decision_context(c, population, area, languages, currencies, borders)}"
        )

        return result

    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return f"Country '{country}' not found. Try the full English name or ISO 2-letter code."
        return f"Country API error: {e.response.status_code}"
    except Exception as e:
        return f"Could not fetch country data: {str(e)}"


def _country_decision_context(c, population, area, languages, currencies, borders):
    lines = []

    # Market size
    if population > 100_000_000:
        lines.append(f"  🌍 Large market: {population / 1_000_000:.0f}M population")
    elif population > 10_000_000:
        lines.append(f"  🌐 Mid-size market: {population / 1_000_000:.0f}M population")
    else:
        lines.append(f"  📍 Small market: {population / 1_000_000:.1f}M population")

    # Multilingual
    if len(languages) > 3:
        lines.append(f"  🗣️  Multilingual ({len(languages)} languages) — localization important")
    elif len(languages) > 1:
        lines.append(f"  🗣️  Bilingual/multilingual ({len(languages)} languages)")

    # Multi-currency risk
    if len(currencies) > 1:
        lines.append(f"  💱 Multiple currencies — FX risk management needed")
    elif currencies:
        code = list(currencies.keys())[0]
        if code == "USD":
            lines.append("  💵 USD economy — no FX conversion needed for US businesses")
        elif code == "EUR":
            lines.append("  💶 Eurozone — single currency across EU members")

    # Connectivity via borders
    if len(borders) > 5:
        lines.append(f"  🔗 Highly connected ({len(borders)} land borders) — good logistics hub")
    elif not borders:
        lines.append("  🏝️  Island/isolated — rely on air/sea freight")

    # Landlocked
    if c.get("landlocked"):
        lines.append("  ⚠️  Landlocked — higher freight costs, no direct sea access")

    return "\n".join(lines) if lines else "  Standard market conditions"
