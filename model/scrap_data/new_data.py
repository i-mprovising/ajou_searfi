import sys,os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from es_handler import ElasticsearchHandler
from utils import get_embedding


def user_keywords():
    pass

def repeated_notices():
    # repeated_data index에서 검색하여 score가 일정 이상이면 index update
    INDEX = "repeated_data"

    ES = ElasticsearchHandler(os.getenv("ES_URI"))
    
    pass
