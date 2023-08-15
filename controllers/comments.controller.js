const {removeCommentById, selectCommentById} = require('../models/comments.model')

function deleteCommentById(request, response, next) {
    const {comment_id} = request;

    const promises = [];
}

module.exports = {deleteCommentById}