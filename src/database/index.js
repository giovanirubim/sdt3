const {connect, prepare} = require('./connector');


class Database {

	constructor(config) {
		this.connPromise = connect(config);
	}

	getConn() {
		return this.connPromise;
	}

	async addUser ({ name, email, password }) {
		const conn = await this.getConn();
		const result = await conn.query(`
			INSERT INTO Usuario SET
			${prepare({ name, email, password })}
		`);
		return result.insertId;
	}
	
	async getUserById(id) {
		const conn = await this.getConn();
		const [ user = null ] = await conn.query(`SELECT * FROM Usuario WHERE id = ${prepare(id)}`);
        return user;
	}

	async getUserByEmail (email) {
		const conn = await this.getConn();
		const [ user = null ] = await conn.query(`SELECT * FROM Usuario WHERE email = ${prepare(email)}`);
        return user;
	}
	
	async setUserTotpSecret ({ userId, secret }) {
		const conn = await this.getConn();
		const result = await conn.query(`
		UPDATE Usuario SET
			${prepare({ secret, userId})}
		`);
        return result.length > 0 ? result[0]:null;
	}
}

module.exports = Database;
