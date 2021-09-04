class BadRequest extends Error {
	constructor() {
		super('Bad request');
	}
};

class Unauthorized extends Error {
	constructor() {
		super('Unauthorized');
	}
};

class NotFound extends Error {
	constructor() {
		super('Not found');
	}
};

class API {
	static async request(method, path, data) {
		const config = {
			url: path,
			method,
		};
		if (data != null) {
			config.contentType = 'application/json; charset=utf-8';
			config.data = JSON.stringify(data);
		}
		try {
			return await $.ajax(config);
		} catch(error) {
			switch (error.status) {
				case 400: throw new BadRequest();
				case 401: throw new Unauthorized();
				case 404: throw new NotFound();
			}
			throw error;
		}
	}

	// Methods
	static get(path, data) {
		return this.request('GET', path, data);
	}
	static post(path, data) {
		return this.request('POST', path, data);
	}
	static delete(path, data) {
		return this.request('DELETE', path, data);
	}

	// Endpoints
	static register(data) {
		return this.post('/api/user', data);
	}
	static login(data) {
		return this.post('/api/login', data);
	}
	static checkLogin() {
		return this.get('/api/login');
	}
	static logout() {
		return this.delete('/api/login');
	}
	static createOtpStep() {
		return this.post('/api/login/otp');
	}
	static removeOtpStep() {
		return this.delete('/api/login/otp');
	}
}
