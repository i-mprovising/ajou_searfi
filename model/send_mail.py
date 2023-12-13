import sys, os, json
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from dotenv import load_dotenv

import smtplib
from email.message import EmailMessage

from search import notice_list
from es_handler import ElasticsearchHandler

def send_msg(recv, id, keywords, notices):
    message = EmailMessage()
    fish_url = "url"
    fish = '𓆝𓆟𓆜𓆞𓆡𓆝𓆟𓆜𓆞𓆡𓆝𓆟𓆜𓆞𓆡𓆝𓆟𓆜𓆞𓆡𓆝𓆟𓆜𓆞𓆡 '
    content = f'검색물고기에서 {id}님의 관심 키워드 {keywords}와 관련 있는 아주대학교 공지사항을 확인해 보세요\n\n{fish_url}\n\n{fish}\n\n\t\t오늘 올라온 공지사항이에요 . . .\n\n'
    for i in notices:
        content += f"\t𓆟 {i}\n\n"
    content += fish
    message.set_content(content)
    message["Subject"] = "[검색물고기] 𓆟 오늘 관심 키워드와 관련이 있는 새로운 공지가 올라왔어요"
    message["From"] = os.getenv('EMAIL_ADDR')  # 보내는 사람의 이메일 계정
    message["To"] = recv # '받는 사람의 이메일 계정'

    return message


def mailing(ES:ElasticsearchHandler, new_posts:list):
    load_dotenv('.env')

    # STMP 서버의 url과 port 번호
    SMTP_SERVER = 'smtp.gmail.com'
    SMTP_PORT = 465

    smtp = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)

    EMAIL_ADDR = os.getenv('EMAIL_ADDR')
    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

    # login in smtp server
    smtp.login(EMAIL_ADDR, EMAIL_PASSWORD) 

    with open(os.getenv("USERINFO"), "r") as f:
        info = json.load(f)
    
    for user in info:
        keywords = user['keyword'].split(',')
        result = notice_list(ES=ES, 
                             INDEX="notice_data", 
                             keywords=keywords) 
        notice_titles = []
        for n in result:
            for i in range(len(new_posts)): # id, title
                if n['noticeid'] in new_posts[i][0]: 
                    notice_titles.append(new_posts[i][1])
        if len(notice_titles) > 0:
            smtp.send_message(send_msg(recv=user['email'],
                                       id = user['id'],
                                       keywords=keywords,
                                       notices=notice_titles))

    smtp.quit()
