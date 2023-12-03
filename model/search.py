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
        range_query = {"query": {
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

        }
        result = ES.search(os.getenv("ES_INDEX"), search_body)
        return ES.process_data(result)

def get_repeated(ES, INDEX):
    data_list = ES.process_data(ES.select_all(index=INDEX))
    per_month = defaultdict(list)
    for data in data_list:
        month = data['date'][5:7]
        per_month[month].append(data)

    return per_month

if __name__=="__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--func', '-f', type=str, help="function to use")
    parser.add_argument('--input', '-i', type=str, help="input of the function")
    args = parser.parse_args()

    ENV_PATH = ".env"
    load_dotenv(ENV_PATH)
    assert os.getenv("ES_URI") is not None, "Elasticsearch uri is None. Please check .env path"
    ES = ElasticsearchHandler(os.getenv("ES_URI"))
    # INDEX = "notice_data"
    INDEX = "repeated_datas"

    if args.func == "notice_list":
        if args.input == "[]":
            print(json.dumps(notice_list(ES, INDEX, [])))
        else:
            input = args.input[1:-1].split(',')
            print(json.dumps(notice_list(ES, INDEX, input)))
    elif args.func == "get_repeated":
        print(json.dumps(get_repeated(ES, "repeated_datas"), ensure_ascii=False))
    elif args.func == "search_result":
        print(json.dumps(search_result(ES, INDEX, args.input), ensure_ascii=False))
