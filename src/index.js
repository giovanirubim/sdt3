require('dotenv').config();
const express = require('express');
const path = require('path');
const api = require('./api');

const { env } = process;

const webContent = path.join(__dirname, 'web-content');
const PORT = env.PORT || 80;
const HOST = env.HOST || '0.0.0.0';

const app = express();

app.use(api);
app.use(express.static(webContent));

app.listen(PORT, HOST, () => {
	console.log('Server started at port ' + PORT);
});
