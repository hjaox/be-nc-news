const {topicsRouter} = require('./topics.router')
const {endpointsRouter} = require('./endpoints.router')
const {articlesRouter} = require('./articles.router')
const {usersRouter} = require('./users.router')
const {commentsRouter} = require('./comments.router')
const apiRouter = require('express').Router();

apiRouter.use('/', endpointsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = {apiRouter};