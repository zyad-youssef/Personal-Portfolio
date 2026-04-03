import math
import statistics
import json

calculate_tool = {
    "name": "calculate",
    "description": (
        "Perform mathematical calculations, statistical analysis, financial formulas, "
        "and data computations. Supports arithmetic, percentages, compound interest, "
        "ROI, break-even analysis, statistics (mean, median, std dev), and more. "
        "Always use this for precise numerical computations rather than estimating."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "operation": {
                "type": "string",
                "enum": [
                    "arithmetic",
                    "percentage",
                    "compound_interest",
                    "roi",
                    "break_even",
                    "statistics",
                    "mortgage",
                    "unit_conversion"
                ],
                "description": "Type of calculation to perform"
            },
            "expression": {
                "type": "string",
                "description": "For arithmetic: math expression like '(1500 * 0.15) + 200'. Uses Python math."
            },
            "params": {
                "type": "object",
                "description": (
                    "Parameters for the operation. Examples:\n"
                    "  percentage: {value: 250, percent: 15, direction: 'of'|'increase'|'decrease'}\n"
                    "  compound_interest: {principal: 10000, rate: 0.07, years: 10, compounds_per_year: 12}\n"
                    "  roi: {gain: 5000, cost: 20000}\n"
                    "  break_even: {fixed_costs: 50000, price_per_unit: 100, variable_cost_per_unit: 60}\n"
                    "  statistics: {data: [1,2,3,4,5]}\n"
                    "  mortgage: {principal: 300000, annual_rate: 0.065, years: 30}\n"
                    "  unit_conversion: {value: 100, from_unit: 'km', to_unit: 'miles'}"
                )
            }
        },
        "required": ["operation"]
    }
}

# Safe math namespace for eval
_SAFE_MATH = {
    "__builtins__": {},
    "abs": abs, "round": round, "min": min, "max": max, "sum": sum,
    "sqrt": math.sqrt, "log": math.log, "log10": math.log10, "log2": math.log2,
    "exp": math.exp, "pow": math.pow, "ceil": math.ceil, "floor": math.floor,
    "pi": math.pi, "e": math.e,
    "sin": math.sin, "cos": math.cos, "tan": math.tan,
}


def execute_calculate(inputs: dict) -> str:
    operation = inputs["operation"]
    expression = inputs.get("expression", "")
    params = inputs.get("params", {})

    try:
        if operation == "arithmetic":
            return _arithmetic(expression)
        elif operation == "percentage":
            return _percentage(params)
        elif operation == "compound_interest":
            return _compound_interest(params)
        elif operation == "roi":
            return _roi(params)
        elif operation == "break_even":
            return _break_even(params)
        elif operation == "statistics":
            return _statistics(params)
        elif operation == "mortgage":
            return _mortgage(params)
        elif operation == "unit_conversion":
            return _unit_conversion(params)
        else:
            return f"Unknown operation: {operation}"
    except Exception as e:
        return f"Calculation error: {str(e)}"


def _arithmetic(expression: str) -> str:
    if not expression:
        return "No expression provided. Pass an 'expression' field."
    # Validate: only allow safe characters
    allowed = set("0123456789.+-*/()% eE,_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
    if not all(c in allowed for c in expression):
        return "Invalid expression. Only numbers and basic operators allowed."
    result = eval(expression, _SAFE_MATH)  # nosec - controlled safe namespace
    return f"Expression: {expression}\nResult: {result:,.6g}"


def _percentage(p: dict) -> str:
    value = float(p.get("value", 0))
    percent = float(p.get("percent", 0))
    direction = p.get("direction", "of")

    if direction == "of":
        result = value * percent / 100
        return (
            f"Percentage Calculation:\n"
            f"  {percent}% of {value:,.2f} = {result:,.4f}"
        )
    elif direction == "increase":
        result = value * (1 + percent / 100)
        increase = result - value
        return (
            f"Percentage Increase:\n"
            f"  {value:,.2f} + {percent}% = {result:,.4f}\n"
            f"  Increase amount: {increase:,.4f}"
        )
    elif direction == "decrease":
        result = value * (1 - percent / 100)
        decrease = value - result
        return (
            f"Percentage Decrease:\n"
            f"  {value:,.2f} - {percent}% = {result:,.4f}\n"
            f"  Decrease amount: {decrease:,.4f}"
        )
    else:
        return "direction must be 'of', 'increase', or 'decrease'"


def _compound_interest(p: dict) -> str:
    principal = float(p.get("principal", 0))
    rate = float(p.get("rate", 0))
    years = float(p.get("years", 0))
    n = float(p.get("compounds_per_year", 12))

    final = principal * (1 + rate / n) ** (n * years)
    total_interest = final - principal
    effective_rate = (1 + rate / n) ** n - 1

    return (
        f"Compound Interest:\n"
        f"  Principal: ${principal:,.2f}\n"
        f"  Annual Rate: {rate * 100:.2f}%\n"
        f"  Periods: {years:.0f} years, compounded {n:.0f}x/year\n"
        f"  ─────────────────────────────\n"
        f"  Final Value: ${final:,.2f}\n"
        f"  Total Interest: ${total_interest:,.2f}\n"
        f"  Effective Annual Rate: {effective_rate * 100:.3f}%\n"
        f"  Total Return: {(total_interest / principal * 100):.1f}%"
    )


def _roi(p: dict) -> str:
    gain = float(p.get("gain", 0))
    cost = float(p.get("cost", 0))
    if cost == 0:
        return "Cost cannot be zero."
    roi = (gain - cost) / cost * 100
    net = gain - cost
    return (
        f"ROI Analysis:\n"
        f"  Investment: ${cost:,.2f}\n"
        f"  Return: ${gain:,.2f}\n"
        f"  Net Profit/Loss: ${net:+,.2f}\n"
        f"  ROI: {roi:+.2f}%\n"
        f"  Decision: {'✅ Profitable' if roi > 0 else '❌ Loss'}"
    )


def _break_even(p: dict) -> str:
    fixed = float(p.get("fixed_costs", 0))
    price = float(p.get("price_per_unit", 0))
    variable = float(p.get("variable_cost_per_unit", 0))

    if price <= variable:
        return "Price per unit must be greater than variable cost per unit."

    contribution_margin = price - variable
    break_even_units = fixed / contribution_margin
    break_even_revenue = break_even_units * price
    margin_pct = contribution_margin / price * 100

    return (
        f"Break-Even Analysis:\n"
        f"  Fixed Costs: ${fixed:,.2f}\n"
        f"  Price/Unit: ${price:,.2f}\n"
        f"  Variable Cost/Unit: ${variable:,.2f}\n"
        f"  Contribution Margin: ${contribution_margin:,.2f} ({margin_pct:.1f}%)\n"
        f"  ─────────────────────────────\n"
        f"  Break-Even Units: {break_even_units:,.0f} units\n"
        f"  Break-Even Revenue: ${break_even_revenue:,.2f}"
    )


def _statistics(p: dict) -> str:
    data = [float(x) for x in p.get("data", [])]
    if not data:
        return "No data provided. Pass 'data' as a list of numbers."

    n = len(data)
    mean = statistics.mean(data)
    median = statistics.median(data)
    min_val = min(data)
    max_val = max(data)
    data_range = max_val - min_val

    lines = [
        f"Statistical Analysis (n={n}):",
        f"  Mean: {mean:,.4f}",
        f"  Median: {median:,.4f}",
        f"  Min: {min_val:,.4f}",
        f"  Max: {max_val:,.4f}",
        f"  Range: {data_range:,.4f}",
    ]

    if n >= 2:
        std = statistics.stdev(data)
        variance = statistics.variance(data)
        lines.append(f"  Std Dev: {std:,.4f}")
        lines.append(f"  Variance: {variance:,.4f}")
        cv = (std / mean * 100) if mean != 0 else 0
        lines.append(f"  Coef. of Variation: {cv:.2f}%")

    if n >= 4:
        q1 = statistics.quantiles(data, n=4)[0]
        q3 = statistics.quantiles(data, n=4)[2]
        iqr = q3 - q1
        lines.append(f"  Q1: {q1:,.4f} | Q3: {q3:,.4f} | IQR: {iqr:,.4f}")

    return "\n".join(lines)


def _mortgage(p: dict) -> str:
    principal = float(p.get("principal", 0))
    annual_rate = float(p.get("annual_rate", 0))
    years = int(p.get("years", 30))

    monthly_rate = annual_rate / 12
    n_payments = years * 12

    if monthly_rate == 0:
        monthly = principal / n_payments
    else:
        monthly = principal * (monthly_rate * (1 + monthly_rate) ** n_payments) / \
                  ((1 + monthly_rate) ** n_payments - 1)

    total_paid = monthly * n_payments
    total_interest = total_paid - principal

    return (
        f"Mortgage Calculator:\n"
        f"  Loan Amount: ${principal:,.2f}\n"
        f"  Annual Rate: {annual_rate * 100:.2f}%\n"
        f"  Term: {years} years ({n_payments:,} payments)\n"
        f"  ─────────────────────────────\n"
        f"  Monthly Payment: ${monthly:,.2f}\n"
        f"  Total Paid: ${total_paid:,.2f}\n"
        f"  Total Interest: ${total_interest:,.2f}\n"
        f"  Interest Ratio: {total_interest / total_paid * 100:.1f}% of total"
    )


def _unit_conversion(p: dict) -> str:
    value = float(p.get("value", 0))
    from_unit = p.get("from_unit", "").lower()
    to_unit = p.get("to_unit", "").lower()

    conversions = {
        # Distance
        ("km", "miles"): 0.621371, ("miles", "km"): 1.60934,
        ("m", "ft"): 3.28084, ("ft", "m"): 0.3048,
        ("cm", "in"): 0.393701, ("in", "cm"): 2.54,
        # Weight
        ("kg", "lbs"): 2.20462, ("lbs", "kg"): 0.453592,
        ("g", "oz"): 0.035274, ("oz", "g"): 28.3495,
        # Temperature (special cases)
        # Volume
        ("l", "gal"): 0.264172, ("gal", "l"): 3.78541,
        ("ml", "fl_oz"): 0.033814, ("fl_oz", "ml"): 29.5735,
        # Area
        ("sqm", "sqft"): 10.7639, ("sqft", "sqm"): 0.0929,
        ("ha", "acres"): 2.47105, ("acres", "ha"): 0.404686,
        # Speed
        ("kmh", "mph"): 0.621371, ("mph", "kmh"): 1.60934,
        ("ms", "kmh"): 3.6, ("kmh", "ms"): 0.277778,
    }

    # Temperature special handling
    if from_unit in ("c", "celsius") and to_unit in ("f", "fahrenheit"):
        result = value * 9 / 5 + 32
        return f"{value}°C = {result:.2f}°F"
    if from_unit in ("f", "fahrenheit") and to_unit in ("c", "celsius"):
        result = (value - 32) * 5 / 9
        return f"{value}°F = {result:.2f}°C"
    if from_unit in ("c", "celsius") and to_unit in ("k", "kelvin"):
        result = value + 273.15
        return f"{value}°C = {result:.2f} K"

    factor = conversions.get((from_unit, to_unit))
    if factor:
        result = value * factor
        return f"{value} {from_unit} = {result:,.4f} {to_unit}"

    supported = ", ".join(f"{f}→{t}" for f, t in conversions.keys())
    return f"Conversion '{from_unit}' → '{to_unit}' not supported.\nSupported: {supported}"
