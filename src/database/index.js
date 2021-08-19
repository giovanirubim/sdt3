const connector = require('./connector');

class Database {
	constructor(config) {
		this.conn = connector.connect(config);
	}
	
	async addUser ({ name, email, password }) {
		const { conn } = this;
		// TODO
		let sql = "INSERT INTO Usuario(name, email, password) VALUES ?";

        const values = [name, email, password];
        sql = mysql.format(sql, values);

        const result = await promisify(conn.query).bind(conn)(sql);
        console.log(result);
        return result.length > 0 ? result[0]:null;
	}
	
	async getUserByEmail ({ email }) {
		const { conn } = this;
		// TODO
		let sql = "SELECT FROM Usuario WHERE Usuario.email=?";

        const values = [email];
        sql = mysql.format(sql, values);

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
