"""
학교 공지사항 스크래핑
기간 : 2021.09 ~ 2023.09
columns : id,category,title,dept,date,time,view,url
          번호, 분류, 제목, 공지부서, 공지일자, 올린 시간, 조회수, url
"""

import yaml
import requests

from bs4 import BeautifulSoup as bs

def get_soup(url):    
  try:  
    res = requests.get(url)             
    return bs(res.text, 'html.parser')
  except:
    print(requests.get(url).status_code)

def scrap(cfg, date, it=20):
  data_list = []
  if it == None: it = 2
  for i in range(it):
    soup = get_soup(cfg['url']+cfg['qstr']+f'{i*10}')
    if i == 0:
      result = soup.select("tr.b-top-box")
      data_list += get_data(result, cfg['url'])
      result = soup.select("tr")[-10:]      
      data_list += get_data(result, cfg['url'])
    else:
      result = soup.select("tr")[-10:]      
      data_list += get_data(result, cfg['url'])
      if data_list[-1]['date'] < date: break

  return data_list

def get_data(results, page):
  data_list = []

  for result in results:
    try:
      data = {}
      res = result.select('td')
      data['page'] = 'NOTI'
      data['category'] = res[1].text.strip()
      link = res[2].select_one('div>a')['href']
      data['url'] = page + link
      data['title'] = res[2].select_one('div>a')['title']
      data['dept'] = res[4].text
      data['date'] = res[5].text
      
      # get context, hit, time inside link
      inside = get_soup(page + link)
      data['time'] = inside.select_one("meta[property='article:published_time']")['content'][11:-1]
      data['view'] = inside.select('div.b-etc-box>ul>li.b-hit-box>span')[1].text
      data['id'] = inside.select_one('div.bn-view-common01>input')['value']
      data_list.append(data)
      print(data['title'], data['date'])
    except Exception as e:
      print(e)
  
  return data_list

if __name__=='__main__':
  # get config
  with open('config.yaml') as f:
    cfg = yaml.load(f, Loader=yaml.FullLoader)
  
  data = scrap(cfg['notice_haksa'])
  print(data[:10])
  