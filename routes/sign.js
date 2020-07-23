const express = require('express')
const createconn = require('../public/js/mysql').createConn
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
  let connection = createconn()
  let sql = `SELECT username FROM usertab WHERE username='${data.phone}'`
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
      sql = `INSERT INTO usertab (username,password,email,nickname) 
             VALUES ('${data.phone}','${data.password}','${data.email}','${data.nickname}')`
      connection.query(sql, function (err, result, fields) {
        if (!err) {
          res.send('success')
        } else {
          res.end('fail')
        }
      })
      connection.end()
    }
  ).catch(
    val => {
      res.send(val)
    }
  )
})

module.exports = router