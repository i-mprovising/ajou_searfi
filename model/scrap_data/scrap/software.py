"""
수학과 공지사항 스크래핑
columns : id, title, date, time, view, url
          번호, 제목, 공지일자, 올린시간, 조회수, url
"""
import yaml
import requests

from datetime import date
from bs4 import BeautifulSoup as bs

def get_soup(url):      
  try:  
    res = requests.get(url)          
    # return bs(res.text, 'html.parser', from_encoding='cp949')
    return bs(res.content.decode('euc-kr', 'replace'), 'html.parser')
  except:
    print(requests.get(url).status_code)

def scrap(cfg, date, it=10):
  data_list = []
  if it == None: it = 2
  for i in range(it):
    soup = get_soup(cfg['url'] + cfg['qstr'] + f'{1+i}')
    result = get_data(soup, cfg['url'])
    data_list += (result)
    if data_list[-1]['date'] < date: break

  return data_list
  
def get_data(soup, page):
  results = soup.select('div.conbody>table')[0].find_all('tr')[3:]
  data_list = []
  
  for i in range(0,len(results),2):
    try :
      data = {}
      res = results[i].select('td')
      if len(res) != 10: continue
      data['page'] = "SOFT"
      data['id'] = res[0].text.strip()
      link = res[2].select_one('a')['href']
      data['url'] = page+link
      data['title'] = res[2].select_one('a').text.strip()
      data['view'] = res[8].text.strip()
      
      inside = get_soup(page + link)
      data['date'] = inside.select('ul.bbs_top>li>span')[1].text.split()[0]
      data['time'] = inside.select('ul.bbs_top>li>span')[1].text.split()[-1]
      data_list.append(data)
      print(data['title'], data['date'])
    except Exception as e:
      print(e)
  
  return data_list
    