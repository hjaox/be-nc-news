const { response } = require('../app');
const {selectArticle,
    allArticlesData} = require('../models/articles.model')

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

function getAllArticlesData(request, response, next) {
    allArticlesData()
    .then((allArticlesData) => {
        const formattedArticlesData = allArticlesData.map(article => {
            const copyArticle = {...article};
            copyArticle.votes = +copyArticle.votes;
            copyArticle.comment_count = +copyArticle.comment_count;
            return copyArticle
        })
        response.status(200).send({articles: formattedArticlesData})
    })
    .catch(err => {
        next(err)
    })
}
    
module.exports = {getArticleById, getAllArticlesData}