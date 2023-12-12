import sys,os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import yaml, re, time, logging

from datetime import date
from dotenv import load_dotenv

from scrap import *
from es_handler import ElasticsearchHandler
from utils import get_embedding
from send_mail import mailing

def get_data(page=None):
    # get config
    fname = os.getenv("CONFIG_PATH")
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
                logging.info(f'scraping {page} done. new data : {len(data_list)}')

        # update date in config(last date of data updated)
        cfg['date'] = str(date.today())
        with open(fname, 'w') as f:
            f.write(yaml.dump(cfg, default_flow_style=False))
        logging.info('update config.yaml')
    
    return data_list

def preprocess(text):
    text = re.sub('(자세히 보기|필독})', '', text)
    text = re.sub('\[]', '', text)
    return text

def update_repeated_notices(ES:ElasticsearchHandler, data_list):
    threshold = 20
    # repeated_data index에서 검색하여 score가 일정 이상이면 index update
    INDEX = "repeated_datas"

    for data in data_list:
        id = data['_id']
        data = data['_source']
        result = ES.search_dense(query=data['title'], 
                                 query_vector=data['title_vector'], 
                                 index=INDEX, 
                                 topk=2)
        if len(result['hits']['hits']) == 0: continue
        res = result['hits']['hits'][0]
        if res['_score'] > threshold:
            logging.info(f"repeated data updated : {res['_source']['title']}")
            ES.delete_id(index="repeated_datas", 
                         id=res['_id'])

            ES.insert(index='repeated_data',
                      id=id,
                      data=data)
            
            time.sleep(1)

def main():
    load_dotenv('.env', verbose=True)

    ES = ElasticsearchHandler(os.getenv('ES_URI'))
    notice_index = os.getenv('ES_INDEX')
    assert ES.es.indices.exists(index=notice_index), "INDEX does not exist"

    data_list = get_data()
    insert_list = [] # for bulk insert
    mail_list = []

    page_code = {
        "아주대학교 공지사항":"NOTI",
        "자연과학대학":"NATU",
        "수학과":"MATH",
        "소프트웨어학과":"SOFT",
        "소프트웨어융합대학":"SWUN"
    }

    matches = ['재공지', 'Remind', 'remind', 'REMIND']
    for data in data_list:
        title = data['title']
        if any(x in title for x in matches):
            continue
        data['title_vector'] = get_embedding(preprocess(title))
        data['date'] = f"{data['date']}T{data['time']}Z"
        data.pop('time', None)
        data['view'] = data['view'].replace(',', '')
        insert_list.append({
            # "_index": notice_index,
            "_id": f"{page_code[data['page']]}_{data['num']}",
            "_source" : data
        })
        assert len(data.keys()) == 9, "numbers of data key not matched"
        try:
            ES.insert(index=notice_index,
                      id=f"{data['page']}_{data['num']}",
                      data=data)
            mail_list.append([f"{data['page']}_{data['num']}", data['title']]) # id, title
        except Exception as e:
            logging.warning(f"exception occured while inserting {page_code[data['page']]}_{data['num']} {data['title']}")

    logging.info('update elasticsearch done.')

    update_repeated_notices(ES, insert_list)
    mailing(ES, mail_list) # 새로 들어오는 데이터 id list
    logging.info('mail send done.')

if __name__=='__main__':
    load_dotenv('.env')

    logging.basicConfig(filename=os.getenv('PY_LOG'), 
                        level=logging.WARNING,
                        format='%(asctime)s\t%(levelname)s\t%(message)s',
                        datefmt='%m/%d/%Y %H:%M:%S')

    main()