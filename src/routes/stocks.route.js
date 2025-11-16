const express = require('express');
const route = express.Router();

const stockController = require('../controllers/stock.controller');

route.post('/stocks', stockController.createStock);
route.get('/stocks', stockController.listStocks);
route.get('/stocks/:symbol', stockController.getStock);

module.exports = route;
