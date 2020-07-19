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
  let sql = `select password,islog from usertab where username='${data.username}'`
  connection.query(sql,function(err, result, fields) {
    if (!err) {
      if (result.length == 0) {
        res.send('empty')
      } else if (result[0].islog == 'active') {
        res.send('active')
      } else if (data.password === result[0].password) {
        sql = `update usertab set islog='active' where username='${data.username}'`
        connection.query(sql, function (err, result, fields) {
          if (!err) {
            res.send('success')
          }
        })
      } else {
        res.end('false')
      }
      connection.end()
    } else {
      console.log(err)
    }
  })
})

module.exports = router