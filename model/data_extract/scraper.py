import os
import yaml
import re

from datetime import date
from dotenv import load_dotenv
from openai import OpenAI

from scrap import *
from es_handler import ElasticsearchHandler

def get_data(page=None):
    # get config
    fname = 'config.yaml'
    with open(fname) as f:
        cfg = yaml.load(f, Loader=yaml.FullLoader)
    
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

def get_embedding(input):
    client = OpenAI()
    response = client.embeddings.create(
        input=input,
        model="text-embedding-ada-002"
    )

    return response.data[0].embedding

def main():
    load_dotenv('../.env', verbose=True)

    ES = ElasticsearchHandler(os.getenv('ES_URI'))
    if ES.indices.exists(index=os.getenv('ES_INDEX')):
        ES.create_index(ES, index=os.getenv('ES_INDEX'))

    data_list = get_data()

    for data in data_list:
        title = data['title']
        matches = ['재공지', 'Remind', 'remind', 'REMIND']
        if any(x in title for x in matches):
            pass
        title = preprocess(title)
        data['title_vector'] = get_embedding(title)
        ES.insert(INDEX_NAME=os.getenv('ES_INDEX'),
                  data=data)

if __name__=='__main__':
    # print(get_data('mathematics'))
    # print(get_data('notice'))
    # print(get_data('naturaluniv'))
    # print(get_data('software'))
    print(get_data('swuniv'))