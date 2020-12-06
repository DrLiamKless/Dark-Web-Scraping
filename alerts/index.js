// import axios from "axios";

const client = require('./elasticConnection')
const Notification = require('./notification')
const Keyword = require('./keyword')

async function alertsChecker () {
    try{
        let allMatchingArticles = []
        const allKeywords = await Keyword.find({})
        keywords = allKeywords.map(keywordObject => keywordObject.keyword.trim())

        keywords.forEach( async (keyword) => {
            const { body } = await client.search(
                {
                    index:"articles",
                    size: 1000,
                    body: {
                        query: {
                            query_string: {
                                fields: ["content^3", "title^2", "author^1"], 
                                query: `*${keyword}*`
                            }
                        }
                    }
                })

                const matchingArticles = body['hits']['hits'].map(hit=>{
                    const result = hit._source;
                    result._id = hit._id;
                    result.keyword = keyword;
                    return result    
                })

            matchingArticles.forEach( async (matchingArticle) => {
                notificationExist = await Notification.find({articleId: matchingArticle._id})
    
                if(!notificationExist.length && Date.now() - new Date(matchingArticle.date).getTime() < 1000*60*10) {
                    const newNotification = new Notification({
                        keyword: matchingArticle.keyword,
                        articleDate: matchingArticle.date,
                        articleAuthor: matchingArticle.author,
                        articleId: matchingArticle._id,
                        seen: false,
                    })
                    console.log('created new!!!', newNotification)
                    newNotification.save()
                }
            })
        })

    } catch (err) {
        console.trace(err)
    }
}
        
    setInterval(() => {
        alertsChecker()
    },1000*60*10)
    
    alertsChecker()