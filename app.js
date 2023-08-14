const express = require('express');
const {getAllTopicsData} = require('./controllers/topics.controller')

const app = express();

app.get('/api/topics', getAllTopicsData)

module.exports = app