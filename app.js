const express = require('express');
const {serverErrorHandler,
    customErrorHandler,
    psqlErrorHandler} = require('./error-handlers/error-handlers');
const {apiRouter} = require('./routers/api.router');


const app = express();

app.use(express.json());

app.use('/api', apiRouter)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app