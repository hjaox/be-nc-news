const {removeCommentById} = require('../models/comments.model')

function deleteCommentById(request, response, next) {
    const {comment_id} = request.params;
    removeCommentById(comment_id)
    .then(() => {
        response.status(204).send()
    })
    .catch(err => {
        next(err)
    })
}

module.exports = {deleteCommentById}