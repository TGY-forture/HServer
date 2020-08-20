const express = require('express')
const {createConn} = require('../public/js/mysql');
let router = express.Router();
const multer  = require('multer');
const upload = multer();


router.get('/', function (req, res, next) {
  let username = req.query.username
  let sql = `SELECT * FROM usertab WHERE username='${username}'`;
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
//验证数据正确性，设置用户 cookie
router.post('/', (req, res, next) => {
  let data = req.body;
  let expires = new Date();
  expires.setDate(expires.getDate() + 30);
  let sql = `SELECT password,islog FROM usertab WHERE username='${data.username}'`;
  let connection = createConn()
  new Promise(function (resolve, reject) {
    connection.query(sql, function (err, results, fields) {
      if (!err) {
        if (results.length === 0) {  //没有找到该账号信息
          reject('empty');
        } else if (results[0].islog === 'active') {  //用户已经登录
          reject('active');
        } else if (data.password === results[0].password) { //当前用户没有登录
          resolve();
        } else { //密码错误
          reject('fail');
        }
      } else { 
        reject('fail');
      }
    })
  }).then(
    () => {
      sql = `UPDATE usertab SET islog='active' WHERE username='${data.username}'`;
      connection.query(sql, function (err, results, fields) {
        connection.end()
        if (!err) {
          // 设置 cookie, https传输
          res.cookie('username', data.username, {expires: data.remember ? expires : 0, sameSite: 'None', secure: true});
          res.send('success');
        } else {
          console.log(err);
        }
      })
    }
  ).catch(
    (val) => {
      connection.end()
      res.send(val)
    }
  )
})

router.put('/', (req, res, next) => {
  let username = req.body.username
  let sql = `UPDATE usertab SET islog='inactive' WHERE username='${username}'`
  let conn = createConn()
  conn.query(sql, (err, results, fields) => {
    conn.end()
    if (!err) {
      res.clearCookie('username')
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
  let conn = createConn();
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
  let conn = createConn();
  new Promise((resolve, reject) => {
    conn.query(sql, (err, results, fields) => {
      if (!err) {
        if (results[0].islog === 'active') {
          reject();
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
      conn.end();
      res.end();
      if (err) {
        console.log(err)
      }
    }
  )
})

module.exports = router