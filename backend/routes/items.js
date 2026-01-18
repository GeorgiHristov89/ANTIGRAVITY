const express = require('express');
const router = express.Router();
const db = require('../db');

// Add a new item
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required' });
        }

        const result = await db.query(
            'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
