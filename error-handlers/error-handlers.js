function psqlErrorHandler(err, _, response, next) {
    if(/^(22P02|23502|42703|2201W|2201X)$/.test(err.code)){
        response.status(400).send({msg: 'Bad Request'})
    } else if(/^(42P01|42601)$/.test(err.code)){
        response.status(404).send({msg: 'Not Found'})
    } else {
        next(err)
    }
}

function customErrorHandler(err, _, response, next) { 
    if(err.status || err.msg) {
        response.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}

function serverErrorHandler(err, _, response, __) {
    response.status(500).send(err)
}

module.exports = {customErrorHandler,serverErrorHandler, psqlErrorHandler}