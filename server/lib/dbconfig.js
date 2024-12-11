const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: '127.0.0.1',
    port: '40040',
    user: 'user',
    password: 'useruser',
    database: 'RealTimeChat',
    connectTimeout: 10000,
    connectionLimit: 30
})
module.exports = {pool}
