const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const { q } = req.query;
        let query = 'SELECT * FROM items';
        let params = [];

        if (q) {
            query += ' WHERE name ILIKE $1 OR description ILIKE $1';
            params.push(`%${q}%`);
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
