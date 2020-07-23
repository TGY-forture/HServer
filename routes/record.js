const express = require('express')
const pool = require('../public/js/mysql').createPool()
const router = express.Router()

router.get('/', function (req, res, next) {
  const table = req.query.tablename
  const seq = req.query.seq
  const totalprocess = req.query.totalprocess
  const company = req.query.company
  let arr = []
  for(let i = 0; i < totalprocess; i++) {
    arr[i] = 'process' + (i + 1)
  }
  let prosql = `SELECT ${arr.toString()} FROM process_${totalprocess} WHERE company='${company}'`
  pool.getConnection((err, conn) => {
    if (!err) {
      conn.query(prosql, function (err, results, fields) {
        if (!err) {
          res.send(results[0])
        } else {
          res.send(err)
        }
      })
    }
  })
  pool.getConnection((err, conn) => {
    conn.release()
  })
  let itemsql = `SELECT * FROM ${table} WHERE seq='${seq}'`
})

module.exports = router