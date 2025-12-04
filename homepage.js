const express = require('express');
const session = require('express-session');
const connection = require('./connect');

const router = express.Router();

router.get('/homepage', (req, res) => {
    if (req.session.email) {
        const email = req.session.email;
        connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                return res.status(500).send('Database query error');
            }
            const user = results[0];
            res.send(`<h1>Hello ${user.name} (${user.email}) :)</h1><a href="/logout">Logout</a>`);
        });
    } else {
        res.redirect('/index.html');
    }
});

module.exports = router;
