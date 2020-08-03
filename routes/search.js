const express = require('express')
const router = express.Router()
const { createConn } = require('../public/js/mysql')

router.get('/', (req, res, next) => {
  let sql = `SELECT company,proname,totalprocess,seq,batch,tablename FROM basicinfo`;
  let conn = createConn();
  conn.query(sql, (err, results, fields) => {
    if (!err) {
      res.send(results);
    } else {
      res.send('fail')
    }
    conn.end();
  })
})

router.get('/data', (req, res, next) => {
  let query = req.query;
  let assitarray = [];
  for (let key in query) {
    assitarray.push(`${key}='${query[key]}'`)
  }
  let sql = `SELECT * FROM protab WHERE ${assitarray.join(' AND ')}`
  let conn = createConn();
  conn.query(sql, (err, results, fields) => {
    if (!err) {
      res.send(results)
    } else {
      res.send('fail')
    }
    conn.end();
  })
})

module.exports = router