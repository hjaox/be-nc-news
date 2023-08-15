const {selectAllUsers} = require('../models/users.model')

function getAllUsers(_, response) {
    selectAllUsers()
    .then(allUsers => {
        response.status(200).send({allUsers})
    })
}

module.exports = {getAllUsers}