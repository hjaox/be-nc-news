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
    const {body} = request.body;
    selectArticle(article_id)
    .then(() => {
        return updateArticle(article_id, body)
    })
    .then((d) => {
        console.log('ctrl line 33')
    })
    .then(err => {
        next(err)
    })
}
    
module.exports = {getArticleById, getAllArticlesData, patchArticleById}