const pool = require('../lib/db');
const redisClient=require('../lib/redis/redisClient');
const createAlert = async (alertData) => {
    const { user_id, stock_id, alert_type, threshold, is_active = true,frequency } = alertData;
    const [result] = await pool.query(
        'INSERT INTO alerts (user_id, stock_id, alert_type, threshold, is_active,frequency) VALUES (?, ?, ?, ?, ?, ?) ',
        [user_id, stock_id, alert_type, threshold, is_active,frequency]
    );
    const sql = `SELECT * FROM users WHERE id=?`;
    const values = [user_id];
    const [rows] = await pool.query(sql, values);
    const [stockRows] = await pool.query('SELECT * FROM stocks WHERE id=?', [stock_id]);
    const user = rows[0];
    const stock = stockRows[0];
    if (alert_type.startsWith("PRICE_")) {
        const member = JSON.stringify({ user_email: user.email, alert_type });
        await redisClient.zadd(`stock:${stock.symbol}`, {score:threshold, value:member});
    }
    redisClient.sAdd(`alerts:subscribed`,alert_type)
    redisClient.sAdd('stocks:subscribed',stock.symbol);
    if(!alert_type.startsWith("PRICE_")){
        const key = `alert:recurring:${stock}:${interval}`;
        const data = await redisClient.hGetAll(key);
        if(Object.keys(data).length !== 0){
            let emails = data.emails ? JSON.parse(data.emails) : [];
            let lastRun = data.lastRun ? parseInt(data.lastRun) : 0;
            if (!emails.includes(newEmail)) {
                emails.push(newEmail);
            }
            await redisClient.hSet(key, "emails", JSON.stringify(emails));
            await redisClient.hSet(key, "lastRun", lastRun);
        }
    }
    return { id: result.insertId, user_id, stock_id, alert_type, threshold, is_active };
};

const getAlertById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM alerts WHERE id = ?', [id]);
    return rows[0];
};

const listAlertsForUser = async (user_id) => {
    const [rows] = await pool.query('SELECT * FROM alerts WHERE user_id = ?', [user_id]);
    return rows;
};

module.exports = { createAlert, getAlertById, listAlertsForUser };