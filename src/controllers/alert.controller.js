const alertService = require('../services/alert.service');

const createAlert = async (req, res) => {
  try {
    const data = req.body;
    const alert = await alertService.createAlert(data);
    res.status(201).json({ alert });
  } catch (err) {
    console.error('createAlert error', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await alertService.getAlertById(id);
    if (!alert) return res.status(404).json({ error: 'Not found' });
    res.json({ alert });
  } catch (err) {
    console.error('getAlert error', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const listAlertsForUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const alerts = await alertService.listAlertsForUser(user_id);
    res.json({ alerts });
  } catch (err) {
    console.error('listAlertsForUser error', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createAlert, getAlert, listAlertsForUser };
