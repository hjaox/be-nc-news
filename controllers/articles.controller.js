const {selectArticle, insertComment} = require('../models/articles.model')

function getArticleById(request, response, next) {
    const {article_id} = request.params;
    selectArticle(article_id)
    .then((articleData) => {
        response.status(200).send({article: articleData})
    })
    .catch((err) => {
        next(err)
    })
}

function postComment(request, response, next) {
    const {article_id} = request.params;
    const {body} = request;
    
    const promises = [selectArticle(article_id), insertComment(article_id, body)];
    return Promise.all(promises)
    .then((promisesResults) => {
        response.status(201).send({postedComment: promisesResults[1]})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getArticleById, postComment}