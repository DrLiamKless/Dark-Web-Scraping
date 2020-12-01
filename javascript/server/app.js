const express = require("express");

const app = express();

app.use(express.json());

const csv = require("csv-parser");

const fs = require("fs");

const articles = [];

app.get("/api/all", (req, res) => {
  fs.createReadStream("data.csv")
    .pipe(csv())
    .on("data", (row) => {
      let article = row;
      articles.push(article);
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
      res.json(articles);
    });
});
app.get("/api/minutes", (req, res) => {
  let d = new Date();
  d.setHours(d.getHours() - 24);

  let filteredArticles = articles.filter((article) => {
    console.log(new Date(article.date) - d);
    return new Date(article.date) - d > 0;
  });
  res.json(filteredArticles);
});

app.get("/api/:search", (req, res) => {
  let filter = req.params.search.toLowerCase();
  let filteredArticles = articles.filter((article) => {
    return (
      article.title.toLowerCase().includes(filter) === true ||
      article.author.toLowerCase().includes(filter) === true ||
      article.content.toLowerCase().includes(filter) === true
    );
  });
  res.json(filteredArticles);
});

module.exports = app;
