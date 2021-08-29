const mysql = require("mysql2/promise");

class Connection {
	constructor(rawConnection) {
		this.rawConnection = rawConnection;
	}
	async query(query) {
		const [result] = await this.rawConnection.execute(query);
		return result;
	}
}

module.exports.connect = async ({ host, port, user, password, database }) => {
    const connection = await mysql.createConnection({
    	host,
    	port,
    	user,
    	password,
    	database,
    });
    return new Connection(connection);
};

module.exports.prepare = mysql.escape;
