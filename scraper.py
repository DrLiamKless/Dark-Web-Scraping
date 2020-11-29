import requests
import json
import socket
from bs4 import BeautifulSoup
import os
from random import randint
from time import sleep
import re    

class Article:
    def __init__(self, title="no title", content="no content", author="Anonymous", views="no views", language="unknown", date="unknown"):
        self.title = title
        self.content = content
        self.author = author
        self.views = views
        self.language = language
        self.date = date

    def __str__(self):
        return f"title:{self.title},\n text:{self.content},\n author:{self.author},\n date:{self.date},\n views{self.views}\n\n"

    def get_info_for_post(self):
        return {
            'title': self.title,
            'content': self.content,
            'author': self.author,
            'views': self.views,
            'language': self.language,
            'date': self.date,
        }


def scraper():

    results = []

    # proxies = {
    #     'http': 'socks5h://127.0.0.1:9050',
    #     'https': 'socks5h://127.0.0.1:9050'
    # }

    try:

        # Get All Existing Articles From Database
        existing_articles_request = requests.get('http://localhost/articles')
        existing_articles = json.loads(existing_articles_request.content)

        # data = requests.get(
        #     "http://nzxj65x32vh2fkhk.onion/all", proxies=proxies).text
        Tor_paste = requests.get(
            "http://localhost:8080/").text
        
        Tor_HTML = BeautifulSoup(Tor_paste, 'html.parser')
        articlesContainer = Tor_HTML.find("section", {"id": "list"})
        articles = articlesContainer.find_all("div", {"class": "col-sm-12"})
        for article in articles:
            try:
                author_info = article.find('div', {'class': 'col-sm-6'}).text.strip()
                post_details = article.find('div', {'class': 'col-sm-6 text-right'}).text

                title = article.find('h4').text.strip()
                content = article.find('div', {'class': 'text'}).find('ol').text.strip()
                author_name = re.findall(r"(?<=Posted by )(.*)(?= at)" , author_info)[0]
                views = re.findall(r"\d+" , post_details)[0]
                # language = re.findall(r"(?<=Language: )(.*)(?= •)" , post_details)
                # print(post_details)
                date = re.findall(r"(?<=at )(.*)(?= UTC)" , author_info)[0]
                newArticle = Article(title, content, author_name, views, language="text", date=date)
                # Make sure article is not exists
                if (len(existing_articles) > 0):
                    for existing_article in existing_articles:
                        if (existing_article["date"] == newArticle.date):
                            # update
                            requests.patch('http://localhost/articles', data=newArticle.get_info_for_post())
                        else:
                            # Post new one
                            print(newArticle.get_info_for_post(),'\n\n')
                            requests.post('http://localhost/articles', data=newArticle.get_info_for_post())
                else:
                    print('OMG posted for the first time!!!!')
                    print(newArticle.get_info_for_post(),'\n\n')
                    requests.post('http://localhost/articles', data=newArticle.get_info_for_post())

                results.append(newArticle) 
            except Exception as e:
                print(e)
        return results

    except:
        print("Site Not Available")
        

scraper()

# with open('data.txt' , mode='w+', encoding="utf-8") as data:

#     for article in scraper():
#         data.write(article.__str__())