const csv = require("csv-parser");

const fs = require("fs");

const articles = [];

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row) => {
    let article = row;
    articles.push(article);
    console.log("yeps");
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
    console.log(articles);
  });
