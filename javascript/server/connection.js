var elasticsearch = require("elasticsearch");
// const { Client } = require("@elastic/elasticsearch");

const client = new elasticsearch.Client({ node: "http://localhost:9200" });

client.cluster.health({}, function (err, resp, status) {
  console.log("-- Client Health --", resp);
});

module.exports = client;
