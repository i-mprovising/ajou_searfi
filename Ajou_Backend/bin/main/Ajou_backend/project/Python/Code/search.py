import os
import json
import argparse
from datetime import datetime, timedelta
from collections import defaultdict
from dotenv import load_dotenv
from es_handler import ElasticsearchHandler
from utils import get_embedding

def search_result(ES:ElasticsearchHandler, INDEX:str, keyword:str):
    # 검색어에 대한 검색 결과
    embedding = get_embedding(keyword)
    return ES.process_data(ES.search_dense(keyword, embedding, index=INDEX, topk=20))

def notice_list(ES, INDEX, keywords:list):
    # noticeid, title, date, url

    if len(keywords) == 0:
        a_month_before = datetime.now().date() + timedelta(days=-30)
        # 키워드가 없을 때 한달 이내 공지사항 목록을 가져온다
        range_query = {
            "sort": {
                "date": "desc"
            },
            "query": {
                "range": {
                    "date": {
                        "gte": a_month_before
                    }
                }
            }
        }
        result = ES.search(INDEX, range_query)
        return ES.process_data(result)
    else:
        search_body = {
            "sort": {
                "date" : "desc"
            },
            "query": {
                "bool": {
                    "should": [
                        {
                        "terms": {
                            "title": keywords
                        }
                        }
                ]
            }
        }
        }
        result = ES.search(INDEX, search_body)
        return ES.process_data(result)

def get_repeated(ES, INDEX):
    data_list = ES.process_data(ES.select_all(index=INDEX))
    per_month = defaultdict(list)
    for data in data_list:
        month = data['date'][5:7]
        per_month[month].append(data)

    return per_month

if __name__=="__main__":
    """
    command : $"python3 search.py --function search_result --input '검색어'"
    arguments : --function=실행할 함수 이름, --input=실행할 함수의 parameter
    실행 가능한 함수:
    1. notice_list
        input에 "[]" 빈 리스트에 해당하는 스트링을 주면 최근 한달 내 공지사항 리스트를 가져옴.
        input에 "[졸업,취업]" 관심 키워드에 해당하는 스트링을 주면 그에 맞는 공지사항 리스트를 가져옴. 
    2. get_repeated
        input 없음. 
        매년 반복되는 예측 공지사항 리스트 가져옴. "01" 월 이름이 key가 되고 value는 해당 월의 공지사항 리스트
    3. search_result
        input에 검색어에 해당하는 스트링을 주면 검색 결과에 해당하는 공지사항 리스트를 가져옴.
    """

    parser = argparse.ArgumentParser()
    parser.add_argument('--func', '-f', type=str, help="function to use")
    parser.add_argument('--input', '-i', type=str, help="input of the function")
    args = parser.parse_args()

    ENV_PATH = "src/main/java/Ajou_backend/project/Python/Code/.env"
    load_dotenv(ENV_PATH)
    assert os.getenv("ES_URI") is not None, "Elasticsearch uri is None. Please check .env path"
    ES = ElasticsearchHandler(os.getenv("ES_URI"))
    INDEX = "notice_data"

    if args.func == "notice_list":
        if args.input == "[]":
            print(json.dumps(notice_list(ES, INDEX, []), ensure_ascii=False))
        else:
            input = args.input[1:-1].split(',')
            print(json.dumps(notice_list(ES, INDEX, input), ensure_ascii=False))
    elif args.func == "get_repeated":
        print(json.dumps(get_repeated(ES, "repeated_datas"), ensure_ascii=False))
    elif args.func == "search_result":
        print(json.dumps(search_result(ES, INDEX, args.input), ensure_ascii=False))
