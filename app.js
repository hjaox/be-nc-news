const express = require('express');
const {getAllTopicsData} = require('./controllers/topics.controller')
const {serverErrorHandler} = require('./error-handlers/error-handlers')
const {getAllEndpoints} = require('./controllers/endpoints.controller')

const app = express();

app.get('/api/topics', getAllTopicsData)

app.get('/api', getAllEndpoints)

app.use(serverErrorHandler)

module.exports = app