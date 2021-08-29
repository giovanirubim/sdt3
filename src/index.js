require('dotenv').config();

const Database = require('./database/index');
const express = require('express');
const path = require('path');
const webContent = path.join(__dirname, 'web-content');
const { env } = process;
const PORT = env.PORT || 80;
const HOST = env.HOST || '0.0.0.0';

const app = express();
app.use(express.static(webContent));
app.listen(PORT, HOST, () => {
	console.log('Server started at port ' + PORT);
});

app.get("/usuario",
		//param('email'),
		Database.getUserByEmail('renan_bertolazo@hotmail.com')
);