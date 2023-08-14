function psqlErrorHandler(err, request, response, next) {
    if(err.code === '22P02') {
        response.status(400).send({msg: 'Bad Request'})
    } else {
        next(err)
    }
}

function customErrorHandler(err, request, response, next) {
    if(err.status || err.msg) {
        response.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}

function serverErrorHandler(err, request, response, next) {
    response.status(500).send(err)
}

module.exports = {customErrorHandler,serverErrorHandler, psqlErrorHandler}