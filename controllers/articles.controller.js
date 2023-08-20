const {selectArticle,
    allArticlesData,
    selectCommentsByArticleId,
    insertComment,
    updateArticle,
    insertArticle} = require('../models/articles.model');
const {selectTopicBySlug,postTopic} = require('../models/topics.model');

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

function getCommentsByArticleId(request, response, next) {
    const {article_id} = request.params;
    const {limit, p} = request.query;
    const promises = [selectArticle(article_id), selectCommentsByArticleId(article_id, limit, p)];

    Promise.all(promises)
    .then((promisesData) => {
        response.status(200).send({comments: promisesData[1]})
    })
    .catch((err) => {
        next(err);
    })
}

function getAllArticlesData(request, response, next) {
    const {topic, sort_by, order, limit, p} = request.query;
    const promises = [allArticlesData(topic, sort_by, order, false, p),allArticlesData(topic, sort_by, order, limit, p)]
    
    return Promise.all(promises)
    .then(promisesData => {
        response.status(200).send({total_count: promisesData[0].length, articles: promisesData[1]})
    })
    .catch(err => {
        next(err)
    })
}

function patchArticleById(request, response, next) {
    const {article_id} = request.params;
    const {body} = request;
    updateArticle(article_id, body)
    .then((updatedArticle) => {
        response.status(200).send({updatedArticle})
    })
    .catch(err => {
        next(err)
    })
}

function postArticle(request, response, next) {
    const {body} = request;
    const {topic} = request.body

    selectTopicBySlug(topic)    
    .then((topicData) => {
        if(!topicData) {
            return postTopic({topic})
        }        
    })
    .then(() => {
        return insertArticle(body) 
    })
    .then(postedArticle => {
        response.status(201).send({postedArticle})
    })
    .catch(err => {
        next(err)
    })
}   
    
module.exports = {getArticleById, getAllArticlesData, getCommentsByArticleId, postComment, patchArticleById, postArticle}