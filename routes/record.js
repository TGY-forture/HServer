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

router.get('/data', (req, res, next) => {
  let seq = req.query.seq;
  let company = req.query.company
  let sql = `SELECT * FROM stateflash WHERE seq='${seq}' AND company='${company}'`
  let conn = createConn()
  conn.query(sql, (err, results, fields) => {
    conn.end()
    if (!err) {
      res.send(results)
    } else {
      res.send('fail')
    }
  })
})

router.put('/', (req, res, next) => {
  let seq = req.body.seq 
  let table = req.body.table
  let sql = `INSERT INTO ${table} (seq) VALUES ('${seq}')`
  let conn = createConn()
  conn.query(sql, (err, results, fields) => {
    conn.end()
    if (!err) {
      res.send('ok')
    } else {
      res.send('fali')
    }
  })
})

router.post('/add', function (req, res, next) {
  let items = req.body.values
  let state = req.body.stateval
  let table = state.table 
  let seq = state.seq 
  let tmparr = []
  for (let key in items) {
    if (key !== 'process')
    tmparr.push(`${key}='${items[key]}'`)
  }
  let sql = `UPDATE ${table} SET ${tmparr.join(',')} WHERE id>1 AND seq='${seq}'`
  let conn = createConn()
  new Promise((resolve, reject) => {
    conn.query(sql, (err, results, fields) => {
      if (!err) {
        resolve('ok')
      } else {
        reject()
      }
    })
  }).then(
    () => {
      sql = `INSERT INTO stateflash (seq,process,name,date,action,company) VALUES 
            ('${state.seq}','${items.process.key}','${state.name}','${state.date}','${state.action}','${state.company}')`
      conn.query(sql, (err, results, fields) => {
        conn.end();
        if (!err) {
          res.send('ok')
        } else {
          res.send('fail')
        }
      })
    }
  ).catch(
    () => {
      conn.end()
      res.send('fail')
    }
  )
})

module.exports = router