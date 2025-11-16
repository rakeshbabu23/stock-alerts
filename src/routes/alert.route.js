const express = require('express');
const route = express.Router();

const alertController = require('../controllers/alert.controller');

route.post('/alerts', alertController.createAlert);
route.get('/alerts/:id', alertController.getAlert);
route.get('/users/:user_id/alerts', alertController.listAlertsForUser);

module.exports = route;
