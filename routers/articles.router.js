const {
    getArticleById,
    getAllArticlesData,
    getCommentsByArticleId,
    postComment,
    patchArticleById
} = require('../controllers/articles.controller');
const articlesRouter = require('express').Router();

articlesRouter.get('/', getAllArticlesData);
articlesRouter.get('/:article_id', getArticleById);
articlesRouter.get('/:article_id/comments', getCommentsByArticleId);
articlesRouter.post('/:article_id/comments', postComment);
articlesRouter.patch('/:article_id', patchArticleById);


module.exports = {articlesRouter}