const pool = require('../lib/db');

const recordAlertHistory = async ({ alert_id, stock_price }) => {
  const [result] = await pool.query(
    'INSERT INTO alert_history (alert_id, stock_price) VALUES (?, ?)',
    [alert_id, stock_price]
  );
  return { id: result.insertId, alert_id, stock_price };
};

const listAlertHistoryForAlert = async (alert_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM alert_history WHERE alert_id = ? ORDER BY triggered_at DESC',
    [alert_id]
  );
  return rows;
};

module.exports = { recordAlertHistory, listAlertHistoryForAlert };
