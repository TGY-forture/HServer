const express = require('express')
const createconn = require('../public/js/mysql').createConn
let router = express.Router()

router.get('/', function (req, res, next) {
  let username = req.query.username
  let conn = createconn()
  let sql = `SELECT * FROM usertab WHERE username='${username}'`
  conn.query(sql, (err, results, fields) => {
    conn.end()
    if (!err) {
      res.send(results[0])
    } else {
      res.send('fail')
    }
  })
})

router.post('/', (req, res, next) => {
  let data = req.body
  let connection = createconn()
  let sql = `SELECT password,islog FROM usertab WHERE username='${data.username}'`
  connection.query(sql,function(err, result, fields) {
    if (!err) {
      if (result.length === 0) {
        res.send('empty')
      } else if (result[0].islog === 'active') {
        res.send('active')
      } else if (data.password === result[0].password) {
        sql = `UPDATE usertab SET islog='active' WHERE username='${data.username}'`
        connection.query(sql, function (err, result, fields) {
          if (!err) {
            res.cookie('username', data.username)
            res.cookie('remember', data.remember)
            res.send('success')
          }
        })
      } else {
        res.end('fail')
      }
      connection.end()
    } else {
      console.log(err)
    }
  })
})

router.put('/', (req, res, next) => {
  const username = req.body.username
  let sql = `UPDATE usertab SET islog='inactive' WHERE username='${username}'`
  let conn = createconn()
  conn.query(sql, (err, results, fields) => {
    conn.end()
    if (!err) {
      res.clearCookie('username')
      res.clearCookie('remember')
      res.send('ok')
    } else {
      res.send('fail')
    }
  })
})

module.exports = router