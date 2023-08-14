const {allTopicsData} = require('../models/topics.mode.controller')

function getAllTopicsData(request, response, next) {
    allTopicsData()
    .then((topicsData) => {
        response.status(200).send(topicsData)
    })
    .then((err) => {
        next(err)
    })
}

module.exports = {getAllTopicsData}