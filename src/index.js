require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const path = require('path');
const api = require('./api');

const { env } = process;

const webContent = path.join(__dirname, 'web-content');
const PORT = env.PORT || 80;
const HOST = env.HOST || '0.0.0.0';

const app = express();

app.use(session({
	secret: crypto.randomBytes(32).toString('hex'),
	resave: false,
	saveUninitialized: false,
}));
app.use(api);
app.use(express.static(webContent));

app.listen(PORT, HOST, () => {
	console.log('Server started at port ' + PORT);
});
