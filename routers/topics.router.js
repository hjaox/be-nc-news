const {getAllTopicsData, postTopic} = require('../controllers/topics.controller');
const topicsRouter = require('express').Router();

topicsRouter.get('/', getAllTopicsData);
topicsRouter.post('/', postTopic)

module.exports = {topicsRouter};