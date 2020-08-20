const express = require('express')
const {createConn} = require('../public/js/mysql')
let router = express.Router();

router.get('/', (req, res, next) => {
  let data = req.query;
  let sql = `SELECT password FROM usertab WHERE username='${data.username}' AND email='${data.email}'`;
  let conn = createConn();
  conn.query(sql, (err, results, fields) => {
    if (!err && results.length > 0) {
      res.send(results[0]);
    } else {
      res.send('fail')
    }
    conn.end();
  })
})

module.exports =  router