const mysql = require('promise-mysql')

module.exports = {
    /** @type {mysql.Connection} */
    connection: null,
    async init(config) {
        let connection = this.connection = await mysql.createConnection({
            host: 'localhost',
            user: config.dbUser,
            password: config.dbPass,
            database: config.dbName
        })
    }
}