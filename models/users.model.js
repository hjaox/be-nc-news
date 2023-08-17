const db = require('../db/connection')

function selectAllUsers() {
    return db.query(`
    SELECT * FROM users`)
    .then(({rows}) => {
        return rows
    })
}

function selectUserByUsername(username) {
    return db.query(`
    SELECT * FROM users
    WHERE username = $1`, [username])
    .then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows[0]
    })
}

module.exports = {selectAllUsers, selectUserByUsername}