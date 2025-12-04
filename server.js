const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const connect = require('./connect');
const homepageRouter = require('./homepage');
const logoutRouter = require('./logout');
const registerRouter = require('./register');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.use('/', express.static('public'));
app.use('/', homepageRouter);
app.use('/', logoutRouter);
app.use('/', registerRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
