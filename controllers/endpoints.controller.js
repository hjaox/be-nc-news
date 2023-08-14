const {readEndpointsFile} = require('../models/endpoints.model')

function getAllEndpoints(request, response, next) {
    readEndpointsFile()
    .then((endpointsFileData) => {
        response.status(200).send(endpointsFileData)
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getAllEndpoints}