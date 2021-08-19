// Retorna a conexão
const mysql = require("mysql2/promise");

module.exports.connect = async ({ host, port, user, password, database }) => {
	// TODO
    const connection = await mysql.createConnection("mysql://"+user+":"+"localhost:"+port+"/"+database);
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
};
