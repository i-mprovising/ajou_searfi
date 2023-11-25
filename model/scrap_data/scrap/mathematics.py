"""
수학과 공지사항 스크래핑
columns : id,category,title,dept,date,due,target,view,url
          번호,분류,제목,공지부서,작성일,공지마감일,공지대상,조회수,url
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
    print(f"Request error - status code : {requests.get(url).status_code}")

def scrap(cfg, date, it=10):
  data_list = []
  if it == None: it = 2
  for i in range(it):
    soup = get_soup(cfg['url']+cfg['qstr']+f'{i*10}')
    try:
      data_list += get_data(soup, cfg['url'])
    except Exception as e:
      print(e)
    if data_list[-1]['date'] < date: break
  
  return data_list

def get_data(soup, page):
  results = soup.select('tr')[1:]
  data_list = []
  
  for result in results:
    try :
      data = {}
      res = result.select('td')
      if len(res)!=7: continue

      data['page'] = 'MATH'
      data['id'] = res[0].text
      link = res[1].select_one('a')['href'] # 페이지 링크
      data['url'] = page+link
      data['title'] = res[1].select_one('a').text.strip()
      data['category'] = res[4].text
      data['due'] = res[5].select_one('img').text
      data['dept'] = res[6].text
      
      # 페이지 내부에서 
      inside = get_soup(page + link)
      tmp_soup = inside.select('div.view_wrap>table')[0].select('tr')[2].select('td')
      data['date'] = tmp_soup[1].text
      data['view'] = tmp_soup[4].text
      data_list.append(data)
      print(data['title'], data['date'])
    except Exception as e:
      print(e)
  
  return data_list
    