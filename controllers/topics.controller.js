const {allTopicsData, insertTopic} = require('../models/topics.model')

function getAllTopicsData(_, response, next) {
    allTopicsData()
    .then((topicsData) => {
        response.status(200).send(topicsData)
    })
    .catch((err) => {
        next(err)
    })
}

function postTopic(request, response, next) {
    const {slug, description} = request.body;
    return insertTopic({slug, description})
    .then(postedTopic => {
        response.status(201).send({postedTopic})
    })
    .catch(err => {
        next(err)
    })
}

module.exports = {getAllTopicsData, postTopic}