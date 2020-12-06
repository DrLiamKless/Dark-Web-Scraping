require('dotenv').config()


//elasticsearch:
const { Client } = require('@elastic/elasticsearch')

const client = new Client({
  node: `http://${process.env.ELASTIC_DB_HOST_NAME}:9200`
})

module.exports = client;
