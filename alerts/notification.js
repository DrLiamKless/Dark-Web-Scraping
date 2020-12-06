const mongoose = require('./mongooseConncetion')

const notificationSchema = {
    keyword: String,
    articleDate: Date,
    articleAuthor: String,
    articleId: String,
    seen: Boolean,
}

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification