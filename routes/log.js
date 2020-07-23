const express = require('express')
const createconn = require('../public/js/mysql').createConn
let router = express.Router()

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

module.exports = router