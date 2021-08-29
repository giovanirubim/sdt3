require('dotenv').config();

const Database = require('./database');
const express = require('express');
const path = require('path');
const webContent = path.join(__dirname, 'web-content');
const { env } = process;
const PORT = env.PORT || 80;
const HOST = env.HOST || '0.0.0.0';

const app = express();

const database = new Database({
	host:env.DB_HOST,
	port:env.DB_PORT,
	user:env.DB_USER,
	password:env.DB_PASS,
	database:env.DB_NAME
});

app.get("/usuario/:id",async (request, response) =>{
		const result = await database.getUserByEmail({email:'renan_bertolazo@hotmail.com'})
		response.status(200).json(result);
}		
);

app.use(express.static(webContent));

app.listen(PORT, HOST, () => {
	console.log('Server started at port ' + PORT);
});
