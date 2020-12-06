const mongoose = require('./mongooseConncetion')

const keywordSchema = {
    keyword: String,
}

const Keyword = mongoose.model("Keyword", keywordSchema);

module.exports = Keyword