const express = require('express')
const router = express.Router()
const createconn = require('../public/js/mysql').createConn

router.get('/', function (req, res, next) {
  let company = req.query.company
  let connection = createconn()
  connection.query(`SELECT * FROM basicinfo WHERE company='${company}'`, function (err, result, fields) {
    if (!err) {
      res.send(result)
    } else {
      res.send('fail')
    } 
    connection.end((err) => {
      if (err) {
        console.log(err)
      }
    })
  })
})

router.get('/getdata', function (req, res, next) {
  let table = req.query.tablename
  let seq = req.query.seq
  let conn = createconn()
  let sql = `SELECT * FROM ${table} WHERE seq='${seq}'`
  conn.query(sql, (err, result, fields) => {
    if (!err && result.length > 0) {
      res.send('exist')
    } else {
      res.send('empty')
    }
  })
  conn.end((err) => {
    if (err) {
      console.log(err)
    }
  })
})
  
module.exports = router