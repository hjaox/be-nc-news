const {selectArticle,
    allArticlesData,
    updateArticle} = require('../models/articles.model')

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

function getAllArticlesData(_, response, next) {
    allArticlesData()
    .then((allArticlesData) => {
        response.status(200).send({articles: allArticlesData})
    })
    .catch(err => {
        next(err)
    })
}

function patchArticleById(request, response, next) {
    const {article_id} = request.params;
    const {body} = request;
    const promises = [selectArticle(article_id), updateArticle(article_id, body)];
    Promise.all(promises)
    .then((promisesResults) => {
        response.status(200).send({updatedArticle: promisesResults[1]})
    })
    .catch(err => {
        next(err)
    })
}
    
module.exports = {getArticleById, getAllArticlesData, patchArticleById}