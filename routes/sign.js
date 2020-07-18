const express = require('express')
const mysql = require('mysql')
let router = express.Router()

router.get('/', function (req, res, next) {
  let code
  do {
    code = (Math.random() * 10000).toFixed()
  } while (code.length != 4)
  res.json(code)
})

router.post('/', (req, res, next) => {
  let data = req.body
  let connection = mysql.createConnection({
    host: 'rm-2zeim991vtb92p54wao.mysql.rds.aliyuncs.com',
    port: '3306',
    user: 'tgy',
    password: 'tgy12345',
    database: 'fac'
  })
  let sql = `select username from usertab where username='${data.phone}'`
  new Promise((reslove, reject) => {
    connection.query(sql, (err, result, fields) => {
      if (!err && result.length > 0) {
        reject('same')
      } else {
        reslove()
      }
    })
  }).then(
    () => {
      sql = `insert into usertab (username,password,email,nickname) 
             values ('${data.phone}','${data.password}','${data.email}','${data.nickname}')`
      connection.query(sql, function (err, result, fields) {
        if (!err) {
          res.send('success')
          connection.end()
        } else {
          res.end('false')
        }
      })
    }
  ).catch(
    val => {
      res.send(val)
    }
  )
})

module.exports = router