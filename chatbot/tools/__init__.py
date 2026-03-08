from .weather import get_weather_tool, execute_get_weather
from .finance import get_market_data_tool, execute_get_market_data
from .news import get_news_tool, execute_get_news
from .search import web_search_tool, execute_web_search
from .calculator import calculate_tool, execute_calculate
from .country import get_country_info_tool, execute_get_country_info

ALL_TOOLS = [
    get_weather_tool,
    get_market_data_tool,
    get_news_tool,
    web_search_tool,
    calculate_tool,
    get_country_info_tool,
]

TOOL_EXECUTORS = {
    "get_weather": execute_get_weather,
    "get_market_data": execute_get_market_data,
    "get_news": execute_get_news,
    "web_search": execute_web_search,
    "calculate": execute_calculate,
    "get_country_info": execute_get_country_info,
}
