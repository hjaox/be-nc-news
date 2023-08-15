const express = require('express');
const {getAllTopicsData} = require('./controllers/topics.controller')
const {serverErrorHandler,
    customErrorHandler,
    psqlErrorHandler} = require('./error-handlers/error-handlers')
const {getArticleById,
    getAllArticlesData,
    getCommentsByArticleId, postComment} = require('./controllers/articles.controller')
const {getAllEndpoints} = require('./controllers/endpoints.controller')

const app = express();

app.use(express.json());

app.get('/api/topics', getAllTopicsData)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticlesData)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postComment)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app