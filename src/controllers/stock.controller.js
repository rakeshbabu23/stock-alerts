const stockService = require('../services/stock.service');

const createStock = async (req, res) => {
  try {
    const stockData = req.body;
    const stock = await stockService.createStock(stockData);
    res.status(201).json({ stock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stock = await stockService.getStockBySymbol(symbol);
    if (!stock) return res.status(404).json({ error: 'Not found' });
    res.json({ stock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const listStocks = async (req, res) => {
  try {
    const stocks = await stockService.listStocks();
    res.json({ stocks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createStock, getStock, listStocks };
