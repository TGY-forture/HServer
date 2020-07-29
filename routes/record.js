const express = require('express')
const { createConn, createPool } = require('../public/js/mysql')
const router = express.Router()

router.get('/', function (req, res, next) {
  const pool = createPool()  //创建连接池
  const table = req.query.tablename
  const totalprocess = req.query.totalprocess
  const company = req.query.company
  let arr = []
  for (let i = 0; i < totalprocess; i++) {
    arr[i] = 'process' + (i + 1)
  }
  const pro = new Promise(function (resolve, reject) {
    let prosql = `SELECT ${arr.toString()} FROM process_${totalprocess} WHERE company='${company}'`
    pool.getConnection((err, conn) => {
      if (!err) {
        conn.query(prosql, function (error, results, fields) {
          conn.release()
          if (!error) {
            resolve(results)
          } else {
            reject('fail')
          }
        })
      }
    })
  })
  const item = new Promise((resolve, reject) => {
    let itemsql = `SELECT * FROM ${table} WHERE id=1`
    pool.getConnection((err, conn) => {
      if (!err) {
        conn.query(itemsql, function (error, results, fields) {
          conn.release()
          if (!error) {
            resolve(results[0])
          } else {
            reject('fail')
          }
        })
      }
    })
  })
  Promise.all([pro, item]).then(
    (val) => {
      res.send(val)
    }
  ).catch(
    (err) => {
      res.end()
      console.log(err)
    }
  )
})

router.post('/', function (req, res, next) {
  let data = req.body
  let dbname = data.dbname
  let seq = data.seq
  let tmparr = []
  for (let key in data) {
    if (key !== 'seq' && key !== 'dbname')
    tmparr.push(`${key}='${data[key]}'`)
  }
  let sql = `UPDATE ${dbname} SET ${tmparr.join(',')} WHERE id>1 AND seq='${seq}'`
  let conn = createConn()
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