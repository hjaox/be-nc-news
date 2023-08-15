const db = require('../db/connection')
const format = require('pg-format')

function selectArticle(article_id) {
    const queryStr = format(`
    SELECT * FROM articles
    WHERE article_id = %L`, [article_id]);

    return db.query(queryStr)
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Not Found'})
        }        
        return rows[0]
    })

}

function insertComment(article_id, article_body) {
    const criteria = ['body', 'author'];
    if(!criteria.every(item => Object.keys(article_body).includes(item))) {
        return Promise.reject({status:400, msg: 'Bad Request'})
    }

    const formattedCommentData = [article_body.body, article_id, article_body.author, 0, new Date().toISOString()];

    const queryStr = format(`
    INSERT INTO comments
    (body, article_id, author, votes, created_at)
    VALUES %L RETURNING *`, [formattedCommentData]);

    return db.query(queryStr)
    .then(({rows}) => {
        return rows[0]
    })
}

module.exports = {selectArticle, insertComment}