const express = require('express');
const {getAllTopicsData} = require('./controllers/topics.controller')
const {serverErrorHandler,
    customErrorHandler,
    psqlErrorHandler} = require('./error-handlers/error-handlers')
const {getArticleById,
    getAllArticlesData,
    patchArticleById} = require('./controllers/articles.controller')
const {getAllEndpoints} = require('./controllers/endpoints.controller')

const app = express();

app.get('/api/topics', getAllTopicsData)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticlesData)

app.patch('/api/articles/:article_id', patchArticleById)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app