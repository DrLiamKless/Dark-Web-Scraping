# Dark-Web-Scraping

An automatic scraper for TOR 'paste' websites.
collects malicious data, sorting it and saves on a local elasticsearch docker-container.

## to activate the scraper:
1. change 'example.env' file's name in app and node folders to '.env'
2. run `docker-compose up -d`

this command will run the following containers:
1. scraper
* the scraper will run every 5 minutes to collect new malicious data.
* notice there will be some data collcetd from the past stored in the articles.csv file

2. elasticsearch db on port 9200

3. TOR proxy image, so the scrapper will be able to run on TOR

4. node - node server + client on port 8080


