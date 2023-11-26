import os
import argparse
from datetime import datetime, timedelta
from collections import defaultdict
from dotenv import load_dotenv
from es_handler import ElasticsearchHandler
from utils import get_embedding

def search_result(keyword:str):
    # 검색어에 대한 검색 결과
    load_dotenv('.env', verbose=True)
    ES = ElasticsearchHandler(os.getenv("ES_URI"))
    embedding = get_embedding(keyword)
    ES.search_dense(keyword, embedding, index="notice_data", topk=20)

    pass

def notice_list(keywords:list):
    # noticeid, title, date, url
    load_dotenv('.env', verbose=True)
    ES = ElasticsearchHandler(os.getenv("ES_URI"))

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
        # result = ES.search(os.getenv("ES_INDEX"), range_query)
        result = ES.search("test_index", range_query)
        return ES.process_data(result)
    else:
        search_body = {

        }
        result = ES.search(os.getenv("ES_INDEX"), search_body)
        return ES.process_data(result)

def get_repeated():
    load_dotenv('.env', verbose=True)
    ES = ElasticsearchHandler(os.getenv("ES_URI"))
    INDEX = "repeated_data"

    data_list = ES.process_data(ES.select_all(INDEX))
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

    if args.func == "notice_list":
        if args.input == "[]":
            print(notice_list([]))
        else:
            input = args.input[1:-1].split(',')
            print(notice_list(input))
    elif args.func == "get_repeated":
        print(get_repeated(args.input))
    elif args.func == "search_result":
        print(search_result(args.input))
        pass
