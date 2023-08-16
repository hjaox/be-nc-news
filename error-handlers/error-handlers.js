function psqlErrorHandler(err, _, response, next) {    
    if(err.code === '22P02' || err.code === '23502') {
        response.status(400).send({msg: 'Bad Request'})
    } else if(err.code === '42P01'){
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

function serverErrorHandler(err, _, response) {
    console.log(err)
    response.status(500).send(err)
}

module.exports = {customErrorHandler,serverErrorHandler, psqlErrorHandler}