const pool = require('../lib/db');

const createUser = async (userData) => {
    const { username, email, password_hash } = userData;
    const [result] = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, password_hash]
    );
    return { id: result.insertId, username, email };
};

module.exports = { createUser };