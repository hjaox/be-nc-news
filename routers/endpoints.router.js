const {getAllEndpoints} = require('../controllers/endpoints.controller');
const endpointsRouter = require('express').Router();

endpointsRouter.get('/', getAllEndpoints);

module.exports = {endpointsRouter};