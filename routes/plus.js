const express = require('express')
const router = express.Router()
const createconn = require('../public/js/mysql').createConn

router.get('/', function (req, res, next) {
  let table = req.query.tablename
  let seq = req.query.seq
  let conn = createconn()
  let sql = `SELECT * FROM ${table} WHERE seq='${seq}' AND id>1`
  conn.query(sql, (err, results, fields) => {
    if (!err && results.length > 0) {
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