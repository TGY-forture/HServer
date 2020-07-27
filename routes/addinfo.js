const express = require('express')
const createconn = require('../public/js/mysql').createConn
const router = express.Router()

router.put('/', (req, res, next) => {
  let data = req.body
  let sql = `SELECT workcode FROM basicinfo WHERE company='${data.company}'`
  let connect = createconn()
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
      sql = `UPDATE usertab SET name='${data.name}',company='${data.company}' WHERE username='18361812729'`
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