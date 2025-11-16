const express = require('express');
const route = express.Router();

const alertHistoryController = require('../controllers/alertHistory.controller');

route.post('/alert-history', alertHistoryController.record);
route.get('/alert-history/:alert_id', alertHistoryController.listForAlert);

module.exports = route;
