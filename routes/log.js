const express = require('express')
const createconn = require('../public/js/mysql').createConn
let router = express.Router()
const multer  = require('multer')
const upload = multer()

router.get('/', function (req, res, next) {
  let username = req.query.username
  let sql = `SELECT * FROM usertab WHERE username='${username}'`
  let conn = createconn()
  conn.query(sql, (err, results, fields) => {
    conn.end()
    if (!err && results.length > 0) {
      res.send(results[0])
    } else {
      res.send('fail')
    }
  })
})

router.post('/', (req, res, next) => {
  let data = req.body;
  let expires = new Date();
  expires.setDate(expires.getDate() + 30);
  let sql = `SELECT password,islog FROM usertab WHERE username='${data.username}'`
  let connection = createconn()
  new Promise(function (resolve, reject) {
    connection.query(sql, function (err, results, fields) {
      if (!err) {
        if (results.length === 0) {
          connection.end()
          reject('empty')
        } else if (results[0].islog === 'active') {
          reject('active')
          connection.end()
        } else if (data.password === results[0].password) {
          resolve()
        } else {
          reject('fail')
        }
      } else {
        console.log(err)
      }
    })
  }).then(
    () => {
      sql = `UPDATE usertab SET islog='active' WHERE username='${data.username}'`
      connection.query(sql, function (err, results, fields) {
        connection.end()
        if (!err) {
          res.cookie('username', data.username, {expires: data.remember ? expires : 0})
          res.send('success')
        } else {
          console.log(err)
        }
      })
    }
  ).catch(
    (val) => {
      res.send(val)
    }
  )
})

router.put('/', (req, res, next) => {
  let username = req.body.username
  let sql = `UPDATE usertab SET islog='inactive' WHERE username='${username}'`
  let conn = createconn()
  conn.query(sql, (err, results, fields) => {
    conn.end()
    if (!err) {
      res.send('ok')
    } else {
      res.send('fail')
    }
  })
})

//关闭页面,重置登录状态
router.post('/logout', upload.none(), (req, res, next) => {
  let username = req.body.username;
  let sql = `UPDATE usertab SET islog='inactive' WHERE username='${username}'`;
  let conn = createconn();
  conn.query(sql, (err, results, fields) => {
    if (!err) {
      console.log('ok')
    } else {
      console.log('fail')
    }
    conn.end();
  })
  res.end(); 
})

router.put('/refresh', (req, res, next) => {
  let username = req.body.username;
  let sql = `SELECT islog FROM usertab WHERE username='${username}'`;
  let conn = createconn();
  new Promise((resolve, reject) => {
    conn.query(sql, (err, results, fields) => {
      if (!err) {
        if (results[0].islog === 'active') {
          reject();
          conn.end();
          res.end();
        } else {
          resolve();
        }
      }
    })
  }).then(
    () => {
      sql = `UPDATE usertab SET islog='active' WHERE username='${username}'`;
      conn.query(sql, (err, results, fields) => {
        if (!err) {
          res.end();
        }
        conn.end();
      })
    }
  ).catch(
    (err) => {
      console.log(err)
    }
  )
})
module.exports = router