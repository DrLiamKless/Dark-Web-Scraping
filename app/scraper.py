import requests
import json
from bs4 import BeautifulSoup
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import ConnectionError
import re
import sys, os
import threading
import csv
import time
from dotenv import load_dotenv
from tempfile import NamedTemporaryFile
import shutil
load_dotenv()

ELASTIC_DB_HOST_NAME = os.environ.get("ELASTIC_DB_HOST_NAME")
TOR_PROXY_HOST_NAME = os.environ.get("TOR_PROXY_HOST_NAME")
CSV_PATH = os.environ.get("CSV_PATH")

# the Article class
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

# creates new index, default = article
def create_index(es_object, index_name='articles'):
    created = False
    # index settings
    settings = {
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0
        },
        "mappings": {
            "article": {
                "dynamic": "strict",
                "properties": {
                    "title": {
                        "type": "text"
                    },
                    "content": {
                        "type": "text"
                    },
                    "author": {
                        "type": "text"
                    },
                    "views": {
                        "type": "integer"
                    },
                    "language": {
                        "type": "text"
                    },
                    "date": {
                        "type": "text"
                    },
                }
            }
        }
    }
    try:
        if not es_object.indices.exists(index_name):
            # Ignore 400 means to ignore "Index Already Exist" error.
            es_object.indices.create(index=index_name, ignore=400, body=settings)
            print('Created Index')
        created = True
    except Exception as ex:
        print(str(ex))
    finally:
        return created

# storing new record to index
def store_record(es_object, index_name, doc_type, record):
    try:
        es_object.index(index=index_name, doc_type=doc_type, body=record)
    except Exception as ex:
        print('Error in indexing data')
        print(str(ex))

# searching in es db
def search(es_object, index_name, search):
    es_object.search(index=index_name, body=search)

# get all articles from es db
def get_all_articles(es_object):
    query = {
        "query": {
            "match_all": {}
        },
        'size': 9999
    }
    results = es_object.search(index='articles', body=query)
    return results['hits']['hits']

# checking if article exists in db by date
def check_if_article_exsits(article ,existing_articles):
    try:
        for existing_article in existing_articles:
            if existing_article['_source']['date'] == article['date']:
                return {'exists': True, 'id': existing_article['_id']}
        return  {'exists': False}
    except Exception as e:
        print(e)

# storing new article
def store_article(es_object, article):
    store_record(es_object, 'articles', 'article', article)

# updates an article by id
def update_article(es_object, id ,article):
    es_object.update(index="articles", doc_type="article", id=id, body={"doc": article})

def update_in_csv(data, filepath):
    updated = 0
    tempfile = NamedTemporaryFile(mode='w', delete=False)
    fields = ['title', 'content', 'author', 'views', 'language', 'date']

    with open(filepath, 'r', ) as csvfile, tempfile:
        reader = csv.DictReader(csvfile, fieldnames=fields)
        writer = csv.DictWriter(tempfile, fieldnames=fields)
        for row in reader:
            if row['date'] == data['date'] and not row['views'] == data['views']:
                print('updating row',  row['title'].strip(), 'inserting', data['views'], 'instead of', row['views'])
                updated = updated + 1
                row['views'] = data['views']
            row = {'title': row['title'], 'content': row['content'], 'author': row['author'], 'views': row['views'], 'language': row['language'], 'date': row['date']}
            writer.writerow(row)
    shutil.move(tempfile.name, filepath)
    return updated

def insert_all_from_csv(filepath, es_object):
    existing_articles = get_all_articles(es_object)
    fields = ['title', 'content', 'author', 'views', 'language', 'date']
    with open(filepath, 'r', ) as csvfile:
        reader = csv.DictReader(csvfile, fieldnames=fields)
        for row in reader:
            row = {'title': row['title'], 'content': row['content'], 'author': row['author'], 'views': row['views'], 'language': row['language'], 'date': row['date']}
            views = re.findall(r'(\d+)', row['views'])
            views = str(''.join(views))
            row['views'] = views
            existing_article = check_if_article_exsits(row, existing_articles)
            if(existing_article['exists'] == False):
                store_article(es_object, row)

proxies = {
    'http': f'socks5h://{TOR_PROXY_HOST_NAME}:9050',
    'https': f'socks5h://{TOR_PROXY_HOST_NAME}:9050'
}


def scraper(es_object):
    page_number = 1
    added = 0
    updated = 0

    try:
        # Get All Existing Articles From Database
        existing_articles = get_all_articles(es_object)

        # mock html when website falls
        # Tor_paste = requests.get(
        #     "http://localhost:8080/").text
        
        while page_number:
            print(f'entering page {page_number}')

            # get all HTML attributes from website and distinguish the articles
            Tor_paste = requests.get(f"http://nzxj65x32vh2fkhk.onion/all?page={page_number}", proxies=proxies).text
            Tor_HTML = BeautifulSoup(Tor_paste, 'html.parser')
            articlesContainer = Tor_HTML.find("section", {"id": "list"})
            articles = articlesContainer.find_all("div", {"class": "col-sm-12"})

            # run on all articles to get data
            for article in articles:
                try:
                    author_info = article.find('div', {'class': 'col-sm-6'}).text.strip()
                    post_details = article.find('div', {'class': 'col-sm-6 text-right'}).text.strip()

                    title = article.find('h4').text.strip()
                    content = article.find('div', {'class': 'text'}).find('ol').text.strip()
                    author_name = re.findall(r"(?<=Posted by )(.*)(?= at)" , author_info)[0]
                    views = re.findall(r"\d+" , post_details)[0]
                    # language = re.findall(r"(?<=Language: )(.*)(?= •)" , post_details)
                    date = re.findall(r"(?<=at )(.*)(?= UTC)" , author_info)[0]
                    newArticle = Article(title, content, author_name, views, language="text", date=date).get_info_for_post()


                    # now we need to make sure the article is not exists, and if so to update it.
                    # checking if existing articles is  not empty:
                    if (len(existing_articles) > 0):
                        existing_article = check_if_article_exsits(newArticle, existing_articles)
                        if existing_article['exists'] == True:
                            update_article(es_object, existing_article['id'], newArticle)
                            _updated = update_in_csv(newArticle, CSV_PATH)
                            updated = updated + _updated
                        else:
                            store_article(es_object, newArticle)
                            update_in_csv(newArticle, CSV_PATH)
                            added = added + 1
                    else:
                        # checks again for the first update through csv
                        existing_articles = get_all_articles(es_object)
                        existing_article = check_if_article_exsits(newArticle, existing_articles)
                        if existing_article['exists'] == False:
                            store_article(es_object, newArticle)
                            update_in_csv(newArticle, CSV_PATH)
                            added = added + 1
            

                except AttributeError:
                    pass
                except Exception as e:
                    exc_type, exc_obj, exc_tb = sys.exc_info()
                    fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                    print(exc_type, fname, exc_tb.tb_lineno, e)
            
            print(f'Summarize for page {page_number}: ===> {added} articles added and {updated} articles updated')

            added = 0
            updated = 0
            page_number = page_number + 1

    except AttributeError:
        print(f'\noops...!\nit seems like page {page_number} not exists\nBye, Bye!')
        page_number = False
    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        print(exc_type, fname, exc_tb.tb_lineno, exc_obj)
        print("Site Not Available", e)        


try:
    # defining elastic search object and creating index
    es = Elasticsearch([{'host': f'{ELASTIC_DB_HOST_NAME}', 'port': 9200}])
    create_index(es)

    # insert to elastic from csv on the first time
    insert_all_from_csv(CSV_PATH ,es)

except ConnectionError:
    print('try again later....')

# make scraper works every 5 mins
def interval_scraper():
    threading.Timer(300, interval_scraper).start()
    scraper(es)

interval_scraper()