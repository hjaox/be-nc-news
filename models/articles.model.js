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

function selectCommentsByArticleId(article_id) {
    const queryStr = format(`
    SELECT * FROM comments
    WHERE article_id = %L
    ORDER BY created_at DESC`, [article_id]);

    return db.query(queryStr)
    .then(({rows}) => {

        return rows
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

module.exports = {selectArticle, allArticlesData, selectCommentsByArticleId}