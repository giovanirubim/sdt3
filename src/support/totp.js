const speakeasy = require( 'speakeasy' );
const qrcode = require( 'qrcode' );
const Base32 = require( './base32' );

// Enviroment variables loaded
let {
	APP_NAME = 'Untitled',
	TOTP_WINDOW = 5,
	TOTP_SECRET_SIZE = 32,
} = process.env;

// Enviroment variables parsed
TOTP_WINDOW = Number(TOTP_WINDOW);
TOTP_SECRET_SIZE = Number(TOTP_SECRET_SIZE);

// TOTP Methods

const getOtpPathUrl = ({ base32 }) => `otpauth://totp/${APP_NAME}?secret=${base32}`;

const generateSecret = () => {
	const secret = speakeasy.generateSecret({ length: TOTP_SECRET_SIZE });
	secret.otpauth_url = getOtpPathUrl(secret);
	return secret;
};

const parseAsciiSecret = (ascii) => {
	const buffer = Buffer.from(ascii, 'ascii');
	const hex = buffer.toString('hex');
	const base32 = Base32.encode(buffer);
	const otpauth_url = getOtpPathUrl({ base32 });
	return { ascii, hex, base32, otpauth_url };
};

const getQRCodeDataURL = (text) => new Promise(
	(done, fail) => qrcode.toDataURL(
		text,
		{
			errorCorrectionLevel: 'M',
			width: 300,
			height: 300,
		},
		(err, data) => err ? fail(err) : done(data),
	),
);

const secretToImage = async ({ otpauth_url }) => {
	const dataURL = await getQRCodeDataURL(otpauth_url);
	const [, mime, encoding, encoded ] = dataURL.match(/data:([^;]+);([^,]*),(.*)$/);
	const buffer = Buffer.from(encoded, encoding);
	return { mime, buffer };
};

const generateToken = (secret, delta = 0) => speakeasy.totp({
	secret: secret.base32,
	encoding: 'base32',
	time: Math.round(Date.now()/1000 + delta),
});

const validateToken = (secret, token) => {
	const tokens = [
		generateToken(secret, - TOTP_WINDOW),
		generateToken(secret, + TOTP_WINDOW),
	];
	console.log({ tokens, token });
	return tokens.includes(token);
};

// Totp class

class Totp {
	constructor(secret) {
		this.secretObj = secret ? parseAsciiSecret(secret) : generateSecret();
		this.secret = this.secretObj.ascii;
	}
	async toQRCode() {
		return secretToImage(this.secretObj);
	}
	token() {
		return generateToken(this.secretObj);
	}
	validate(token) {
		return validateToken(this.secretObj, token);
	}
}

module.exports = Totp;
