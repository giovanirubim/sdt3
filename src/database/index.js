const connector = require('./connector');

class Database {
	constructor(config) {
		this.connPromise = connector.connect(config);
	}

	getConn() {
		return this.connPromise;
	}
	
	async addUser ({ name, email, password }) {
		const conn = await this.getConn();
		const { prepare } = conn;
		const result = await conn.query(`
			INSERT INTO Usuario SET
			${prepare({ name, email, password })}
		`);
		return result.insertId;
	}
	
	async getUserByEmail ({ email }) {
		const { conn } = this;
		// TODO
		let sql = `SELECT FROM Usuario WHERE email = ${prepare(email)}`;

        const result = await promisify(conn.query).bind(conn)(sql);
        console.log(result);
        return result.length > 0 ? result[0]:null;
	}
	
	async setTotpSecret ({ userId, secret }) {
		const { conn } = this;
		// TODO
		let sql = " UPDATE Usuario SET secret=?, WHERE Usuario.id=?";
        let values = [secret, userId];

		const result = await promisify(conn.query).bind(conn)(sql);
        console.log(result);
        return result.length > 0 ? result[0]:null;
	}
}

module.exports = Database;
