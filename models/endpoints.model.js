const fs = require('fs/promises')

function readEndpointsFile() {
    return fs.readFile('./endpoints.json', 'utf-8')
    .then((endpointsFileData) => {
        return JSON.parse(endpointsFileData)
    })
}

module.exports = {readEndpointsFile}