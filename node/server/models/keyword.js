const mongoose = require('../mongooseConnection')

const keywordSchema = {
    keyword: String,
}

const Keyword = mongoose.model("Keyword", keywordSchema);

module.exports = Keyword