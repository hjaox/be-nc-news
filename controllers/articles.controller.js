const {selectArticle,
    selectCommentsByArticleId} = require('../models/articles.model')

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

function getCommentsByArticleId(request, response, next) {
    const {article_id} = request.params;
    selectCommentsByArticleId(article_id)
    .then((commentsByArticleIdData) => {
        response.status(200).send({comments: commentsByArticleIdData})
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = {getArticleById, getCommentsByArticleId}