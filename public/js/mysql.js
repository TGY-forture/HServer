const mysql = require('mysql')

function createConn() {
  let connection = mysql.createConnection({
    host: 'rm-2zeim991vtb92p54wao.mysql.rds.aliyuncs.com',
    port: '3306',
    user: 'tgy',
    password: 'tgy12345',
    database: 'fac',
    multipleStatements: true
  })
  connection.connect(function (err) {
    if (err) {
      console.log(err.stack);
      return;
    }
  })
  return connection
}

function createPool() {
  let pool = mysql.createPool({
    host: 'rm-2zeim991vtb92p54wao.mysql.rds.aliyuncs.com',
    port: '3306',
    user: 'tgy',
    password: 'tgy12345',
    database: 'fac',
    connectionLimit: 5,
    multipleStatements: true
  })
  return pool
}

module.exports = {createConn, createPool}