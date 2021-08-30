const { connect, prepare } = require('./connector');


class Database {

	constructor(config) {
		this.connPromise = connect(config);
	}

	getConn() {
		return this.connPromise;
	}

	async addUser({ name, email, password }) {
		const conn = await this.getConn();
		const result = await conn.query(`INSERT INTO User SET ${prepare({ name, email, password })}`);
		const user = {
			id: result.insertId,
			name, email, password, secret: null,
		};
		return user;
	}

	async getUserById(id) {
		const conn = await this.getConn();
		const [ user = null ] = await conn.query(`SELECT * FROM User WHERE ${prepare({ id })}`);
        return user;
	}

	async getUserByEmail(email) {
		const conn = await this.getConn();
		const [ user = null ] = await conn.query(`SELECT * FROM User WHERE ${prepare({ email })}`);
        return user;
	}
	
	async setUserTotpSecret({ userId, secret }) {
		const conn = await this.getConn();
		const result = await conn.query(`UPDATE User SET ${prepare({ secret })} WHERE ${prepare({ id: userId })}`);
        return result.length > 0 ? result[0]:null;
	}
}

module.exports = Database;
