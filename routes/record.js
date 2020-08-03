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
            resolve(results) //两条记录,顺序排列不需判断
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
            resolve(results[0])  //一条记录
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

router.get('/pronum', function (req, res, next) {
  let seq = req.query.seq;
  let table = req.query.tablename
  let sql = `SELECT havedone FROM ${table} WHERE id>1 AND seq='${seq}'`;
  let conn = createConn();
  conn.query(sql, (err, results, fields) => {
    conn.end();
    if (!err && results.length > 0) {
      res.send(results[0]);
    } else {
      res.send('fail')
    }
  })
})

router.delete('/', (req, res, next) => {
  let company = req.query.company
  let sql = `SELECT MAX(id) AS flag FROM stateflash WHERE company='${company}'`
  let conn = createConn()
  new Promise((resolve, reject) => {
    conn.query(sql, (err, results, fields) => {
      if (!err) {
        resolve(results[0].flag)
      } else {
        reject('fail')
      }
    })
  }).then(
    (val) => {
      sql = `DELETE FROM stateflash WHERE id=${val};ALTER TABLE stateflash AUTO_INCREMENT=1`
      conn.query(sql, (err, results, fields) => {
        conn.end()
        if (!err) {
          res.send('ok')
        } else {
          res.send('fail')
        }
      })
    }
  ).catch(
    (err) => {
      conn.end()
      res.send(err)
    }
  )
})

router.put('/', (req, res, next) => {
  let seq = req.body.seq 
  let table = req.body.table
  let batch = req.body.batch;
  let sql = `INSERT INTO ${table} (seq,havedone,batch) VALUES ('${seq}',0,'${batch}')`
  let conn = createConn()
  conn.query(sql, (err, results, fields) => {
    conn.end()
    if (!err) {
      res.send('ok')
    } else {
      console.log(err)
      res.send('fail')
    }
  })
})

router.post('/', function (req, res, next) {
  let items = req.body.values
  let state = req.body.stateval
  let table = state.table 
  let seq = state.seq 
  let tmparr = []
  for (let key in items) {
    if (key !== 'process' && key !== 'havedone') {
      tmparr.push(`${key}='${items[key]}'`)
    } else if (key !== 'process' && key === 'havedone') {
      tmparr.push(`${key}=${items[key]}`)
    }
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
            ('${state.seq}','${items.process}','${state.name}','${state.date}',
            '${state.action}','${state.company}')`
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