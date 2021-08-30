const express = require('express');

const Database = require('../database');
const Totp = require('../support/totp');

const { env } = process;

const database = new Database({
	host: env.DB_HOST,
	port: env.DB_PORT,
	user: env.DB_USER,
	password: env.DB_PASS,
	database: env.DB_NAME,
});

const api = express.Router();

api.use(express.json());

async function register({ body, session }, res) {
	const { name, email, password } = body;
	const user = await database.addUser({ name, email, password });
	session.userId = user.id;
	res.status(200).json({ id: user.id });
}

async function login({ session, body }, res) {
	const { email, password, token } = body;
	let user = await database.getUserByEmail(email);
	if (!user) {
		return res.status(404).end();
	}
	if (user.password != password) {
		return res.status(401).end();
	}
	if (user.secret) {
		if (!token) {
			return res.status(400).end();
		}
		const totp = new Totp(user.secret);
		if (!totp.validate(token)) {
			return res.status(401).end();
		}
	}
	session.userId = user.id;
	res.status(200).json({
		id: user.id,
		name: user.name,
		email,
		hasOtp: !!user.secret,
	});
}

async function createOtpStep({ session }, res) {
	if (!session.userId) {
		return res.status(401).end();
	}
	const user = await database.getUserById(session.userId);
	const { secret } = new Totp();
	await database.setUserTotpSecret({
		userId: user.id,
		secret,
	});
	res.status(200).end();
}

async function removeOtpStep({ session }, res) {
	if (!session.userId) {
		return res.status(401).end();
	}
	const user = await database.getUserById(session.userId);
	await database.setUserTotpSecret({
		userId: user.id,
		secret: null,
	});
	res.status(200).end();
}

async function checkLogin({ session }, res) {
	if (session.userId) {
		const user = await database.getUserById(session.userId);
		const { id, name, email, secret } = user;
		const hasOtp = !!secret;
		res.status(200).json({ id, name, email, hasOtp });
	} else {
		res.status(404).end();
	}
}

async function logOut({ session }, res) {
	session.userId = null;
	res.status(200).end();
}

async function getOtpQRCodeImage({ session }, res) {
	if (!session.userId) {
		return res.status(401).end();
	}
	const user = await database.getUserById(session.userId);
	if (!user.secret) {
		return res.status(404).end();
	}
	const { buffer, mime } = await new Totp(user.secret).toQRCode();
	res.status(200)
	res.set({
		'content-type': mime,
		'content-length': buffer.length,
	});
	res.write(buffer);
	res.end();
}

const safe = (method) => async (req, res) => {
	try {
		await method(req, res);
	} catch(error) {
		console.error(error);
		res.status(500).end();
	}
};

api.post('/api/user', safe(register));
api.post('/api/login', safe(login));
api.get('/api/login', safe(checkLogin));
api.delete('/api/login', safe(logOut));
api.post('/api/login/otp', safe(createOtpStep));
api.delete('/api/login/otp', safe(removeOtpStep));
api.get('/api/login/otp/qr-code', safe(getOtpQRCodeImage));

module.exports = api;
