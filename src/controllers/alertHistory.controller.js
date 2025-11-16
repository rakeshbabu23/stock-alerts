const alertHistoryService = require('../services/alertHistory.service');

const record = async (req, res) => {
  try {
    const { alert_id, stock_price } = req.body;
    const rec = await alertHistoryService.recordAlertHistory({ alert_id, stock_price });
    res.status(201).json({ record: rec });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const listForAlert = async (req, res) => {
  try {
    const { alert_id } = req.params;
    const history = await alertHistoryService.listAlertHistoryForAlert(alert_id);
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { record, listForAlert };
