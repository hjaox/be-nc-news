const {getAllTopicsData} = require('../controllers/topics.controller');
const topicsRouter = require('express').Router();

topicsRouter.get('/', getAllTopicsData);

module.exports = {topicsRouter};