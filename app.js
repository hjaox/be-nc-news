const express = require('express');
const {getAllTopicsData} = require('./controllers/topics.controller')
const {serverErrorHandler,
    customErrorHandler,
    psqlErrorHandler} = require('./error-handlers/error-handlers')
const {getArticleById,
    getAllArticlesData,
    getCommentsByArticleId, postComment,
    patchArticleById} = require('./controllers/articles.controller')
const {getAllEndpoints} = require('./controllers/endpoints.controller')
const {getAllUsers} = require('./controllers/users.controller')

const app = express();

app.use(express.json());

app.get('/api/topics', getAllTopicsData)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticlesData)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.get('/api/users', getAllUsers)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticleById)

app.use(psqlErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app