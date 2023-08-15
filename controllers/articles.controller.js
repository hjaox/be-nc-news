const {selectArticle,
    allArticlesData,
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
    const promises = [selectArticle(article_id), selectCommentsByArticleId(article_id)];

    Promise.all(promises)
    .then((promisesData) => {
        response.status(200).send({comments: promisesData[1]})
    })
    .catch((err) => {
        next(err);
    })
}

function getAllArticlesData(_, response, next) {
    allArticlesData()
    .then((allArticlesData) => {
        response.status(200).send({articles: allArticlesData})
    })
    .catch(err => {
        next(err)
    })
}
    
module.exports = {getArticleById, getAllArticlesData, getCommentsByArticleId}