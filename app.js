const express = require('express');
const {getAllTopicsData} = require('./controllers/topics.controller')
const {serverErrorHandler} = require('./error-handlers/error-handlers')

const app = express();

app.get('/api/topics', getAllTopicsData)

app.use(serverErrorHandler)

module.exports = app