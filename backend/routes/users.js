const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.get('/me', authenticateToken, async (req, res) => {
    try {
        const result = await db.query('SELECT id, username, email FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) return res.sendStatus(404);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = router;
