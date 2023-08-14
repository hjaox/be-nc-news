const db = require('../db/connection')
const format = require('pg-format')

function selectArticle(article_id) {
    const queryStr = format(`
    SELECT * FROM articles
    WHERE article_id = %L`, [article_id])

    return db.query(queryStr)
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 400, msg: 'Bad Request'})
        }
        
        return rows[0]
    })

}

module.exports = {selectArticle}