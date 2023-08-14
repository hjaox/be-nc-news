function customErrorHandler(err, request, response, next) {
    
}

function serverErrorHandler(err, request, response, next) {
    response.status(500).send(err)
}

module.exports = {customErrorHandler,serverErrorHandler}