const express = require('express')
const {createConn} = require('../public/js/mysql')
const router = express.Router()

router.get('/', (req, res, next) => {
  let sql = `SELECT company FROM basicinfo`;
  let conn = createConn()
  conn.query(sql, (err, results, fields) => {
    conn.end()
    if (!err) {
      res.send(results)
    } else {
      res.send('fail')
    }
  })
})

router.get('/all', (req, res, next) => {
  const company = req.query.company
  let sql = `SELECT * FROM basicinfo WHERE company='${company}'`;
  let conn = createConn()
  conn.query(sql, (err, results, fields) => {
    conn.end()
    if (!err && results.length > 0) {
      res.send(results[0])
    } else {
      res.send('fail')
    }
  })
})

router.put('/', (req, res, next) => {
  let data = req.body
  let sql = `SELECT workcode FROM basicinfo WHERE company='${data.company}'`
  let connect = createConn()
  new Promise((resolve, reject) => {
    connect.query(sql, function (err, results, fields) {
      if (!err && data.workcode === results[0].workcode) {
        resolve()
      } else {
        reject('fail')
        connect.end()
      }
    })
  }).then(
    () => {
      sql = `UPDATE usertab SET name='${data.name}',company='${data.company}' WHERE username='${data.username}'`
      connect.query(sql, (err, results, fields) => {
        connect.end()
        if (!err) {
          res.send('ok')
        } else {
          res.send('fail')
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