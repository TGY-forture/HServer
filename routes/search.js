const express = require('express')
const router = express.Router()
const mysql = require('mysql')

router.get('/', function (req, res, next) {
  let query = req.query
  let datesql = query.date ? `date='${query.date}'` : ``
  let managersql = (query.manager && query.date) ? ` and manager='${query.manager}'`: (query.manager ? `manager='${query.manager}'` : ``)
  let seqsql = ((query.date || query.manager) && query.seq) ? ` and seq='${query.seq}'`: (query.seq ? `seq='${query.seq}'` : ``)
  let batchsql = ((query.date || query.manager || query.seq) && query.batch) ? ` and batch='${query.batch}'` : (query.batch ? `batch='${query.batch}'` : ``)
  let sql = `select * from protab where ${datesql}${managersql}${seqsql}${batchsql}`

  connection.query(sql, function (err, result, fields) {
    if (!err) {
      res.send(result)
      connection.end()
    } else {
      res.send('err')
    }
  })
})

module.exports = router