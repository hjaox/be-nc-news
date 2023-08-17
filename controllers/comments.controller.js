const {removeCommentById, updateCommentById} = require('../models/comments.model')

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

function patchCommentById(request, response, next) {
    const {comment_id} = request.params;
    const {inc_votes} = request.body;
    updateCommentById(comment_id, inc_votes)
    .then((updatedComment) => {
        response.status(200).send({updatedComment})
    })
    .catch(err => {
        next(err)
    })
}

module.exports = {deleteCommentById, patchCommentById}