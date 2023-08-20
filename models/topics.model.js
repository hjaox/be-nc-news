const db = require('../db/connection')
const format = require('pg-format')

function allTopicsData() {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows
    })
}

function selectTopicBySlug(slug) {
    return db.query(`
    SELECT * FROM topics
    WHERE slug = $1`, [slug])
    .then(({rows}) => {
        return rows[0]
    })
}

function insertTopic(body) {
    const queryStr = format(`
    INSERT INTO topics
    (slug, description)
    VALUES %L RETURNING *`, [[body.slug, body.description]])
    return db.query(queryStr)
    .then(({rows}) => {
        return rows[0]
    })    
}

module.exports = {allTopicsData, selectTopicBySlug, insertTopic}