"""
학교 공지사항 스크래핑
기간 : 2021.09 ~ 2023.09
columns : num, 
번호, 분류, 페이지 url, 제목, 이미지, 올린 부서, 올린 날짜, 시간, 내용, 조회수
"""

import yaml
import requests

from datetime import date
from bs4 import BeautifulSoup as bs

def get_soup(url):    
  try:  
    res = requests.get(url)             
    return bs(res.text, 'html.parser')
  except:
    print(requests.get(url).status_code)

def scrap(cfg, date, it=10):
  data_list = []
  if it == None: it = 2
  for i in range(it):
    soup = get_soup(cfg['url']+cfg['qstr']+f'{i*10}')
    if i == 0:
      result = soup.select("tr.b-top-box")
      data_list += get_data(result, cfg['url'])
    else:
      result = soup.select("tr")[-10:]
      data_list += get_data(result, cfg['url'])
      if data_list[-1]['date'] < date: break

  return data_list

def get_data(results, page):
  data_list = []

  for result in results:
    res = result.select('td')
    if len(res) != 6: continue
    try :
      data = {}
      data['page'] = '소프트웨어융합대학'
      data['cateory'] = res[1].text.strip()
      link = res[2].select_one('div>a')['href']
      data['url'] = page+link
      ti = res[2].select_one('div>a').text
      ti = ti.replace("[공지]", "").strip()
      data['title'] = '"' + ti + '"'
      data['dept'] = res[4].text
      data['date'] = res[5].text

      # get context, hit, time inside link
      inside = get_soup(page + link)
      data['time'] = inside.select_one("meta[property='article:published_time']")['content'][11:-1]
      data['view'] = inside.select('div.b-etc-box>ul>li.b-hit-box>span')[1].text
      data['num'] = inside.select_one('div.bn-view-common01>input')['value']
      data_list.append(data)
      print(data['title'], data['date'])
    except Exception as e:
      print(e)

  return data_list
