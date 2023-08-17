const db = require('../db/connection')

function removeCommentById(comment_id) {    
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1 RETURNING *`, [comment_id])
    .then(({rowCount}) => {
        if(!rowCount) {
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
    })
}

function updateCommentById(comment_id, newVotes) {
    if(!newVotes) {
        return Promise.reject({status: 400, msg: 'Bad Request'})
    }

    return db.query(`
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2 RETURNING *`, [newVotes, comment_id])
    .then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({status:404, msg: 'Not Found'})
        }
        return rows[0]
    })
}

module.exports = {removeCommentById, updateCommentById}