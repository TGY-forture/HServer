const express = require('express')
const createconn = require('../public/js/mysql').createConn
const router = express.Router()
const multer = require('multer') //引入muter,获取form-data数据，此处为图片
const upload = multer() //不传递参数，即不保存文件

router.post('/', upload.single('avatar'), (req, res, next) => {
  let buf = req.file.buffer
  let username = req.body.username
  let str = buf.toString('hex')   //toJSON方法转换为json对象
  let sql = `UPDATE picture SET photo='${str}' WHERE username='${username}'`
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

router.get('/', (req, res,next) => {
  let username = req.query.username
  let sql = `SELECT photo FROM picture WHERE username='${username}'`
  let connect = createconn()
  connect.query(sql, (err, results, fields) => {
    connect.end()
    if (!err && results.length > 0) {
      res.send(Buffer.from(results[0].photo, 'hex'))
    } else {
      res.end()
    }
  })
})

router.put('/', (req, res, next) => {
  let body = req.body
  let sql = `UPDATE usertab SET age=${body.age},nickname='${body.nickname}',
            email='${body.email}',sex='${body.sex}' WHERE username='${body.username}'`
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

module.exports = router