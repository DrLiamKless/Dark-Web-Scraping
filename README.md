# Dark-Web-Scraping

An automatic scraper for TOR 'paste' websites.
collects malicious data, sorting it and saves on a local elasticsearch docker-container.

## to activate the scraper:
1. change 'example.env' file's name to '.env'
2. run `docker-compose up -d`

this command will run the scraper and will collect the data automatically.
* the scraper will run every 5 minutes to collect new malicious data.
* notice there will be some data collcetd in the past stored in the articles.csv file

## want to export the data?
1. go to your cli
2. get your scraper container id using `docker ps -aqf "name=scraper"`
3. download the csvfile using `docker cp <container_id>:/app/app/articles.csv <your/destination/path>`
4. replace between the new csv file and the old one. the scraper knows to automatically add the new data each run.
enjoy!


