const db = require('../db/connection')
const format = require('pg-format')

function selectArticle(article_id) {
    const queryStr = format(`
    SELECT articles.*, COALESCE (COUNT(comments.comment_id)::INT, 0) AS comment_count FROM articles
    LEFT JOIN comments on articles.article_id = comments.article_id
    WHERE articles.article_id = %L
    GROUP BY articles.article_id`, [article_id]);

    return db.query(queryStr)
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Not Found'})
        }        
        return rows[0]
    })
}

function selectCommentsByArticleId(article_id, limit=10, p=1) {
    const queryStr = format(`
    SELECT * FROM comments
    WHERE article_id = %L
    ORDER BY created_at DESC
    LIMIT %s
    OFFSET %s`, [article_id], [limit], [(p-1)*limit]);

    return db.query(queryStr)
    .then(({rows}) => {
        return rows
    })
}

function allArticlesData(topic, sort_by='created_at', order, limit=10, p = 1) {
    let baseQueryStr = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.article_img_url, articles.votes, COUNT(comments.body)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    LEFT JOIN topics ON topics.slug = articles.topic `;

    if(topic) {
        baseQueryStr += format(`
        WHERE topics.slug ILIKE %L `, [topic]);
    }
        
    baseQueryStr = baseQueryStr + format(`
    GROUP BY articles.article_id
    ORDER BY articles.%s `,[sort_by]);
            
    if(order) {
        if(!/(asc|desc)/i.test(order)) {
            return Promise.reject({status:400, msg: 'Bad Request'});
        } else if(order === 'asc') {
            baseQueryStr += `ASC `;
        } else {
            baseQueryStr += `DESC `;
        }
    } else {
        baseQueryStr += `DESC `;
    }

    if(limit) {
        baseQueryStr += format(`
        LIMIT %s
        OFFSET %s`, [limit], [(p-1)*limit])
    }
    
    return db.query(baseQueryStr)
    .then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows
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

function updateArticle(article_id, article_body) {
    if(!Object.keys(article_body).includes('inc_votes')) {
        return Promise.reject({status: 400, msg: 'Bad Request'})        
    }
    return db.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2 RETURNING *`, [article_body.inc_votes, article_id])
    .then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows[0]
    })
}

function insertArticle(article_body) {
    const criteria = ['title', 'topic', 'author', 'body'];
    if(!criteria.every(item => Object.keys(article_body).includes(item))) {
        return Promise.reject({status:400, msg: 'Bad Request'})
    }
    
    article_body.article_img_url ? article_body.article_img_url : article_body.article_img_url = 'Please provide image url';

    const queryStr = format(`
    INSERT INTO articles
    (title, topic, author, body, article_img_url)
    VALUES %L RETURNING *`,[[article_body.title, article_body.topic, article_body.author,article_body.body, article_body.article_img_url]]);
    
    return db.query(queryStr)
    .then(({rows}) => {
        return selectArticle(rows[0].article_id)
    })
}

module.exports = {selectArticle, allArticlesData, selectCommentsByArticleId, insertComment, updateArticle, insertArticle}