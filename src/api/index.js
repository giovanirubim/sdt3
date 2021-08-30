const express = require('express');

const Database = require('../database');
const Totp = require('../support/totp');

const { env } = process;

const database = new Database({
	host:env.DB_HOST,
	port:env.DB_PORT,
	user:env.DB_USER,
	password:env.DB_PASS,
	database:env.DB_NAME
});

const api = express.Router();

let session = {
	user: null,
	logged: false,
	logged_password: false,
	logged_otp: false,
};

api.get('/api/otp-token/qr-code', async (req, res) => {
	// if (!session.logged) {
	// 	return res.status(401).end();
	// }
	const { buffer, mime } = await new Totp('NetS5r3#<)n5mc96(#f!X4t!wl5SZPtB').toQRCode();
	res.status(200)
	res.set({
		'content-type': mime,
		'content-length': buffer.length,
	});
	res.write(buffer);
	res.end();
});

api.post('/api/login', async (req, res) => {
	const { email, password } = req.query;
	let user = await database.getUserByEmail(email);
	if (!user) {
		return res.stauts(404).end();
	}
	if (user.password !== password) {
		return res.status(401).end();
	}
	session.user = user;
	session.logged_password = true;
	if (user.secret == null) {
		session.logged_status = true;
		return res.status(200).end();
	}
	return res.status(202).end();
});

api.post('/api/logout', async (req, res) => {
	session = {};
	res.status(200).end();
});

api.post('/api/login/otp-token', async (req, res) => {
	const { token } = req.query;
	if (!session.user || !session.logged_password) {
		return res.status(409).end();
	}
	if (!new Totp(session.user.secret).validate(token)) {
		return res.status(401).end();
	}
	session.logged_otp = true;
	session.logged = true;
	res.status(200).end();
});

module.exports = api;
