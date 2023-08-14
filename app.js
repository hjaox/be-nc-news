const express = require('express');
const {getAllTopicsData} = require('./controllers/topics.controller')
const {serverErrorHandler,
    customErrorHandler,
    psqlErrorHandler} = require('./error-handlers/error-handlers')
const {getArticleById} = require('./controllers/articles.controller')

const app = express();

app.get('/api/topics', getAllTopicsData)

app.get('/api/articles/:article_id', getArticleById)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app