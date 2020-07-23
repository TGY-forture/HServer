var express = require('express');
var router = express.Router();
const createconn = require('../public/js/mysql').createConn

router.get('/index', function(req, res, next) {
  let username = req.query.username
  let connection = createconn()
  let sql = `SELECT username,age,sex,email,nickname,company,workcode,islog FROM usertab WHERE username='${username}'`
  connection.query(sql, (err, result, fields) => {
    if (!err) {
      res.send(result)
    } else {
      res.send('server error')
    }
    connection.end((err) => {
      if (err) {
        console.log(err)
      }
    })
  })
});

router.put('/index', function (req, res, next) {
  let data = req.body
  let conn = createconn()
  let sql = `UPDATE usertab SET islog='${data.islog}' WHERE username='${data.username}'`
  conn.query(sql, (err, result, fields) => {
    if (!err) {
      res.send('ok')
    } else {
      res.end('fail')
    }
    conn.destroy()
  })
})

module.exports = router;
