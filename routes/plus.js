const express = require('express')
const router = express.Router()
const mysql = require('mysql')

router.get('/', function (req, res, next) {
  let seq = req.query.seq
  let connection = mysql.createConnection({
    host: 'rm-2zeim991vtb92p54wao.mysql.rds.aliyuncs.com',
    port: '3306',
    user: 'tgy',
    password: 'tgy12345',
    database: 'fac'
  })
  connection.query(`select * from protab where seq='${seq}'`, function (err, result, fields) {
    if (!err && result.length >0) {
      res.send('success')
    } else if (err) {
      res.send('fail')
    } else {
      res.send('empty')
    }
    connection.end()
  })
})

router.put('/', function (req, res, next) {
  let data = req.body
  let connection = mysql.createConnection({
    host: 'rm-2zeim991vtb92p54wao.mysql.rds.aliyuncs.com',
    port: '3306',
    user: 'tgy',
    password: 'tgy12345',
    database: 'fac'
  })
  let sql = `insert into protab (seq,name,batch) values ('${data.seq}','${data.name}','${data.seq}')`
  connection.query(sql, (err, result, fields) => {
    if (!err) {
      res.send('ok')
    } else {
      res.end()
    }
    connection.end()
  })
})

module.exports = router