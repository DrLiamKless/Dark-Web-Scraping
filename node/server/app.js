const express = require("express");

const client = require('./connection')

const app = express();

app.use(express.json());

app.get("/api/es/last24h", async (req, res) => {

  try{
    const { body } = await client.search({
      index:"articles",
      body: {
        query:{
          range:{
             date:{
              gte: "2020-12-01T00:00:00", 
              lt: now,
             }
          }
       },
        size: 1000,
      }
    })
    console.log(body)
    res.json(body['hits']['hits'].map(hit=>hit._source))
  } catch (e) {
    console.log(e)
  }
});

app.get("/api/es/all", async (req, res) => {
  const { body } = await client.search({index:"articles", size: 1000})
  console.log(body)
  res.json(body['hits']['hits'].map(hit=>hit._source))
});

app.get("/api/es/search/:search", async (req, res) => {
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
});

app.get("/api/es/labels/:label", async (req, res) => {
  let label = req.params.label.toLowerCase();
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
});

module.exports = app;
