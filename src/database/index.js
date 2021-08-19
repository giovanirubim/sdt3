const connector = require('./connector');

class Database {
	constructor(config) {
		this.conn = connector.connect(config);
	}
	
	async addUser ({ name, email, password }) {
		const { conn } = this;
		// TODO
	}
	
	async getUserByEmail ({ email }) {
		const { conn } = this;
		// TODO
	}
	
	async setTotpSecret ({ userId, secret }) {
		const { conn } = this;
		// TODO
	}
}

module.exports = Database;
