const pool = require('../lib/db');

const createStock = async (stockData) => {
  const { symbol, name } = stockData;
  const [result] = await pool.query(
    'INSERT INTO stocks (symbol, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name);',
    [symbol, name]
  );
  // For mysql2 with promise API, result may not contain rows; return the inserted id
  return { symbol, name };
};

const getStockBySymbol = async (symbol) => {
  const [rows] = await pool.query('SELECT * FROM stocks WHERE symbol = ?', [symbol]);
  return rows[0];
};

const listStocks = async () => {
  const [rows] = await pool.query('SELECT * FROM stocks ORDER BY symbol');
  return rows;
};

module.exports = { createStock, getStockBySymbol, listStocks };
