const express = require("express");

const client = require('./elasticConnection')

const Notification = require('./models/notification')
const Keyword = require('./models/keyword')

const app = express();

app.use(express.json());

const path = require('path');
const { O_CREAT } = require("constants");

app.use(express.static(path.join(__dirname, 'build')));

app.get("/api/es/data/labelsLastWeek", async (req, res) => {
  try{
    const { body } = await client.search({
      index:"articles",
      body: {
        query:{
          range:{
             date:{
              gte: 'now-1w', 
              lt: 'now',
             }
          }
       },
        size: 1000,
        sort: {'date':{'order': 'desc'}}
      }
    })

    results = []
    sum = {}
    const allLabels = ['weapons', 'pedophile', 'sexual', 'money', 'buisness', 'social_media', 'other']
    allLabels.forEach(label => {
      sum[label] = 0
    })

    allArticles = body['hits']['hits'].map(hit=>hit._source)

    allArticles.forEach(article => {
      console.log('mlsdkfknlksfklslkfsdklfsd',allArticles.labels)
      if(article.labels) {
        labelsArray = article.labels.split(' ')
        labelsArray.forEach(label => {
          sum[label.split('-')[0]] = sum[label.split('-')[0]] + 1 
        })
      } else {
        sum['other'] = sum['other'] + 1
      }
    });

    for (let [key, value] of Object.entries(sum)) {
      results.push({name: key, am: value})
    }



    res.json(results)
  } catch (e) {
    console.trace(e)
  }
});

app.get("/api/es/data/bytime", async (req, res) => {
  try{
    const { body } = await client.search({
      index:"articles",
      body: {
        query:{
          range:{
             date:{
              gte: 'now-1w', 
              lt: 'now',
             }
          }
       },
        size: 1000,
        sort: {'date':{'order': 'desc'}}
      }
    })

    allArticles = body['hits']['hits'].map(hit=>hit._source)

    results = []
    sum = {}
    const allHours = ['morning', 'noon', 'night', 'midnight']
    allHours.forEach(hour => {
      sum[hour] = 0
    })

    allArticles.forEach(article => {
      hours = new Date(article.date).getHours()
      if (hours >= 6 && hours < 12) {
        sum.morning = sum.morning + 1
      }
      else if (hours >= 12 && hours < 18) {
        sum.noon = sum.noon + 1
      }
      else if (hours >= 18 && hours <=23) {
        sum.night = sum.night + 1
      }
      else if (hours >= 0 && hours < 6) {
        sum.midnight = sum.midnight + 1
      }
    });

    for (let [key, value] of Object.entries(sum)) {
      results.push({time: key, am: value})
    }

    res.json(results)
  } catch (e) {
    console.trace(e)
  }
});

app.get("/api/es/all", async (req, res) => {
  try {
    const { body } = await client.search({
      index:"articles", 
      body: {
        sort: {'date':{'order': 'desc'}}
      },
      size: 1000
    })
    res.json(body['hits']['hits'].map(hit=>hit._source))
  } catch(err) {
    console.trace(err)
  }
});

app.get("/api/es/search/:search", async (req, res) => {
  try {

    let filter = req.params.search.toLowerCase();
    const { body } = await client.search(
      {
        index:"articles",
        size: 1000,
        body: {
          query: {
            query_string: {
              fields: ["content^3", "title^2", "author^1"], 
              query: `*${filter}*`
            }
          }
        }
      })
      res.json(body['hits']['hits'].map(hit=>hit._source))
    } catch (err) {
      console.trace(err)
    }
});

app.get("/api/es/labels/:label", async (req, res) => {
  let label = req.params.label.toLowerCase();
  try {
  const { body } = await client.search(
    {
      index:"articles",
      size: 1000,
      body: {
        query: {
          match: {
            labels: label
          }
        }
      }
    })
    res.json(body['hits']['hits'].map(hit=>hit._source))
  } catch (err) {
    console.trace(err)
  }
});

app.get("/api/mongo/keywords", async (req, res) => {
  try{
    const keywords = await Keyword.find({})
    res.json(keywords)
  } catch (err) {
    console.trace(err)
  }
})

app.get("/api/mongo/notifications/unseen", async (req, res) => {
  try{
    const notifications = await Notification.find({seen:{$eq: false}})
    res.json(notifications)
  } catch (err) {
    console.trace(err)
  }
})

app.get("/api/mongo/notifications/seen", async (req, res) => {
  try{
    const notifications = await Notification.find({seen:{$eq: true}})
    res.json(notifications)
  } catch (err) {
    console.trace(err)
  }
})

app.put("/api/mongo/notifications/update/:id", async (req, res) => {
  let notificationId = req.params.id
  try{
    const updatedNotification = await Notification.findByIdAndUpdate(notificationId, {seen: true}, { new: true })
    res.json(updatedNotification)
  } catch (err) {
    console.trace(err)
  }
})

app.post("/api/mongo/keywords/add", async (req, res) => {
  let keyword = req.body
  try{
    const newKeyword = new Keyword(keyword)
    await newKeyword.save()
    res.json(newKeyword)
  } catch (err) {
    console.trace(err)
  }
})
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = app;
