// npm i mysql2
const mysql = require('mysql2/promise'); 

// Create a connection pool
const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'aula_back_end',
});

module.exports = Object.freeze({
  pool: pool
});