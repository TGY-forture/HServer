const express = require('express')
const mysql = require('mysql')
let router = express.Router()

router.post('/', (req, res, next) => {
  let data = req.body
  let connection = mysql.createConnection({
    host: 'rm-2zeim991vtb92p54wao.mysql.rds.aliyuncs.com',
    port: '3306',
    user: 'tgy',
    password: 'tgy12345',
    database: 'fac'
  })
  let sql = `select password from usertab where username=${data.username}`
  connection.query(sql,function(err, result, fields) {
    if (!err) {
      if (data.password === result[0].password) {
        res.send('success')
      } else {
        res.end('false')
      }
      connection.end()
    }
  })
})

module.exports = router