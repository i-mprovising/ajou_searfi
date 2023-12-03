import sys,os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import yaml
import re
import csv

from datetime import date
from dotenv import load_dotenv
from openai import OpenAI

from scrap import *
from es_handler import ElasticsearchHandler
from utils import get_embedding

def get_data(page=None):
    # get config
    fname = os.getenv("CONFIG_PATH")
    with open(fname) as f:
        cfg = yaml.load(f, Loader=yaml.FullLoader)
    
    # get scrapped data from url
    if page is not None: # get data on specified page for test
        scrap = getattr(eval(page), 'scrap')
        data_list = scrap(cfg[page], cfg[page]['date'])
    else:
        data_list = []
        for page, v in cfg.items():
            if page != 'date':
                scrap = getattr(eval(page), 'scrap')
                data_list += scrap(cfg[page], cfg['date'])
                print(len(data_list))

        # update date in config(last date of data updated)
        cfg[page]['date'] = str(date.today())
        with open(fname, 'w') as f:
            f.write(yaml.dump(cfg, default_flow_style=False))

    save_list = [v.values() for v in data_list]
    f = open("./model/test/data/new_data.tsv", "w")
    csv.writer(f, delimiter='\t')
    f.close()
    
    return data_list

def preprocess(text):
    text = re.sub('(자세히 보기|필독})', '', text)
    text = re.sub('\[]', '', text)
    return text

def repeated_notices(ES:ElasticsearchHandler, data_list):
    threshold = 20
    # repeated_data index에서 검색하여 score가 일정 이상이면 index update
    INDEX = "repeated_data"
    # ES.create_index(INDEX) # create index if not exists

    for data in data_list:
        result = ES.search_dense(data['title'], data['title_vector'], INDEX, topk=2)
        if len(result['hits']['hits']) == 0: continue
        first_data = result['hits']['hits'][0]
        if first_data['_score'] > threshold:
            ES.update_id(index=INDEX, id=first_data['_id'], data=data['_source']) # 해당 id 데이터 update

def main():
    load_dotenv('.env', verbose=True)

    ES = ElasticsearchHandler(os.getenv('ES_URI'))
    notice_index = os.getenv('ES_INDEX')
    assert ES.es.indices.exists(index=notice_index), "INDEX does not exist"

    data_list = get_data()
    insert_list = [] # for bulk insert
    source_list = []

    matches = ['재공지', 'Remind', 'remind', 'REMIND']
    for data in data_list:
        title = data['title']
        if any(x in title for x in matches):
            continue
        data['title_vector'] = get_embedding(preprocess(title))
        data['date'] = f"{data['date']}T{data['time']}Z"
        data.pop('time', None)
        data['view'] = data['view'].replace(',', '')
        # insert_list.append({
        #     "_index": notice_index,
        #     "_id": f"{data['page']}_{data['num']}",
        #     "_source" : data
        # })
        assert len(data.keys()) == 9, "numbers of data key not matched"
        try:
            ES.insert(index=notice_index,
                      id=f"{data['page']}_{data['num']}",
                      data=data)
        except Exception as e:
            print(e)
            print(data['page'], data['num'], data['title'])

        source_list.append(data)

    repeated_notices(ES, source_list)
    # print("insert bulk")
    # ES.insert_bulk(insert_list)


if __name__=='__main__':
    # print(get_data('mathematics'))
    # print(get_data('notice'))
    # print(get_data('naturaluniv'))
    # print(get_data('software'))
    # load_dotenv('.env', verbose=True)

    # data_list = get_data('swuniv')
    # for data in data_list:
    #     title = data['title']
    #     embedding = get_embedding(title)
    #     breakpoint()

    main()