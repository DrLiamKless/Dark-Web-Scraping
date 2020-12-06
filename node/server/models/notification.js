const mongoose = require('../mongooseConnection')

const notificationSchema = {
    keyword: String,
    articleDate: Date,
    articleAuthor: String,
    articleId: String,
    seen: Boolean,
}

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification