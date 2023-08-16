const {selectAllUsers} = require('../models/users.model')

function getAllUsers(_, response, next) {
    selectAllUsers()
    .then(users => {
        response.status(200).send({users})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getAllUsers}