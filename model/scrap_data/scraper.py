import sys,os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import yaml
import re

from datetime import date
from dotenv import load_dotenv
from openai import OpenAI

from scrap import *
from es_handler import ElasticsearchHandler
from utils import get_embedding

def get_data(page=None):
    # get config
    fname = 'config.yaml'
    with open(fname) as f:
        cfg = yaml.load(f, Loader=yaml.FullLoader)
    
    # get scrapped data from url
    if page is not None: # get data on specified page for test
        scrap = getattr(eval(page), 'scrap')
        data_list = scrap(cfg[page], cfg['date'])
    else:
        data_list = []
        for page, v in cfg.items():
            if page != 'date':
                scrap = getattr(eval(page), 'scrap')
                data_list += scrap(cfg[page], cfg['date'])

        # update date in config(last date of data updated)
        cfg[page]['date'] = str(date.today())
        with open(fname, 'w') as f:
            f.write(yaml.dump(cfg, default_flow_style=False))
    
    return data_list

def preprocess(text):
    text = re.sub('(자세히 보기|필독})', '', text)
    text = re.sub('\[]', '', text)
    return text

def repeated_notices(ES, data_list):
    threshold = 5
    # repeated_data index에서 검색하여 score가 일정 이상이면 index update
    INDEX = "repeated_data"
    ES.create_index(INDEX) # create index if not exists

    for data in data_list:
        result = ES.search_dense(data['title'], data['title_vector'], INDEX, topk=2)
        for hit in result['hits']['hits']:
            if hit['_score'] >= threshold:
                ES.update_id(INDEX, hit['_id'], hit['_source']) # 해당 id 데이터 update

def main():
    load_dotenv('.env', verbose=True)

    ES = ElasticsearchHandler(os.getenv('ES_URI'))
    if not ES.indices.exists(index=os.getenv('ES_INDEX')):
        ES.create_index(ES, index=os.getenv('ES_INDEX'))

    data_list = get_data()
    source_list = []
    insert_list = [] # for bulk insert
    index = os.getenb("ES_URI")

    for data in data_list:
        title = data['title']
        matches = ['재공지', 'Remind', 'remind', 'REMIND']
        if any(x in title for x in matches):
            pass
        data['title_vector'] = get_embedding(preprocess(title))
        insert_list.append({
            "_index": index,
            "_id": f"{data['page']}_{data['id']}",
            "_source" : data
        })
        source_list.append(data)
        # ES.insert(INDEX_NAME=os.getenv('ES_INDEX'),
        #           data=data)

    repeated_notices(ES, data_list)
    ES.insert_bulk(insert_list)


if __name__=='__main__':
    # print(get_data('mathematics'))
    # print(get_data('notice'))
    # print(get_data('naturaluniv'))
    print(get_data('software'))
    # load_dotenv('.env', verbose=True)

    # data_list = get_data('swuniv')
    # for data in data_list:
    #     title = data['title']
    #     embedding = get_embedding(title)
    #     breakpoint()