const db = require('../db/connection')

function allTopicsData() {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows
    })
}

module.exports = {allTopicsData}