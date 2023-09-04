const express = require('express');
const {serverErrorHandler,
    customErrorHandler,
    psqlErrorHandler} = require('./error-handlers/error-handlers');
const {apiRouter} = require('./routers/api.router');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use(serverErrorHandler)

module.exports = app