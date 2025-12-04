const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('./connect');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }
        if (results.length > 0) {
            return res.status(400).send('Email Address Already Exists!');
        } else {
            connection.query('INSERT INTO users (email, name, password) VALUES (?, ?, ?)', [email, name, hashedPassword], (err) => {
                if (err) {
                    return res.status(500).send('Error inserting user');
                }
                res.redirect('/index.html');
            });
        }
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }
        if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.email = user.email;
                return res.redirect('/homepage');
            } else {
                return res.status(400).send('Incorrect Email or Password');
            }
        } else {
            return res.status(400).send('Not Found, Incorrect Email or Password');
        }
    });
});

module.exports = router;
