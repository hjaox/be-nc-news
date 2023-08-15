const db = require('../db/connection')
const format = require('pg-format')

function selectArticle(article_id) {
    const queryStr = format(`
    SELECT * FROM articles
    WHERE article_id = %L`, [article_id])

    return db.query(queryStr)
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Not Found'})
        }        
        return rows[0]
    })
}

function allArticlesData() {
    return db.query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url, articles.votes, COUNT(comments.body)::INT AS comment_count
        FROM articles 
        JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC`)

    .then(({rows}) => {
        return rows
    })
}

function updateArticle(article_id, article_body) {
    if(Object.keys(article_body).length !== 1 || !Object.keys(article_body).includes('inc_votes')) {
        return Promise.reject({status: 400, msg: 'Bad Request'})        
    }
    return db.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2 RETURNING *`, [article_body.inc_votes, article_id])
    .then(({rows}) => {
        return rows[0]
    })
}

module.exports = {selectArticle, allArticlesData, updateArticle}