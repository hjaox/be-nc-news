const db = require('../db/connection')

function selectAllUsers() {
    return db.query(`
    SELECT * FROM users`)
    .then(({rows}) => {
        return rows
    })
}

module.exports = {selectAllUsers}