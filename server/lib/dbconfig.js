const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: '211.197.178.97',
    port: '40040',
    user: 'kym',
    password: 'azsx2033!',
    database: 'RealTimeChat',
    connectTimeout: 10000,
    connectionLimit: 30
})
module.exports = {pool}