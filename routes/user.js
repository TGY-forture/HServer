const express = require('express')
const createconn = require('../public/js/mysql').createConn
const router = express.Router()
const multer = require('multer') //引入muter,获取form-data数据，此处为图片
const upload = multer() //不传递参数，即不保存文件

router.post('/', upload.single('avatar'), (req, res, next) => {
  let src = req.file.buffer.data
  // let conn = createconn()
  // let sql = `INSERT INTO picture photo VALUES '${src}'`
  // conn.query(sql, (err, results, fields) => {
  //   conn.end()
  //   if (!err) {
  //     res.send(results)
  //   } else {
  //     res.send(err)
  //   }
  // })
})

module.exports = router