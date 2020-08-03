const express = require('express');
const router = express.Router();
const {createConn, createPool} = require('../public/js/mysql')

router.get('/', function(req, res, next) {
  let query = req.query;
  let pool = createPool();
  const pro = new Promise((resolve, reject) => {
    let sql = `SELECT * FROM protab WHERE seq='${query.seq}' AND company='${query.company}'`
    pool.getConnection(function (err, conn) {
      if (!err) {
        conn.query(sql, (error, results, fields) => {
          conn.release();
          if (!error) {
            resolve(results[0])
          } else {
            reject('fail')
          }
        })
      }
    })
  })
  const flow = new Promise((resolve, reject) => {
    let sql = `SELECT tablename,totalprocess FROM basicinfo WHERE company='${query.company}'`
    pool.getConnection(function (err, conn) {
      if (!err) {
        conn.query(sql, (error, results, fields) => {
          conn.release();
          if (!error) {
            resolve(results[0]);
          } else {
            reject('fail')
          }
        })
      }
    })
  }).then(
    (res) => {
      let sql = `SELECT * FROM process_${res.totalprocess} WHERE company='${query.company}';
                 SELECT * FROM ${res.tablename} WHERE id=1 OR seq='${query.seq}'`;     
      return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
          if (!err) {
            conn.query(sql, (error, results, fields) => {
              conn.release();
              if (!error) {
                resolve(results)
              } else {
                reject('fail')
              }
            })
          }
        })   
      })  
    }
  ).catch(
    val => {
      console.log(val)
    }
  )
  Promise.all([pro, flow]).then(
    value => {
      res.send(value)
    }
  ).catch(
    err => {
      console.log(err);
      res.send('fail')
    }
  )
});

router.post('/', (req, res, next) => {
  let body = req.body;
  let sql = `INSERT INTO protab (seq,name,batch,date,company) VALUES ('${body.seq}','${body.name}','${body.batch}','${body.date}','${body.company}')`;
  let conn = createConn();
  conn.query(sql, (err, results, fields) => {
    if (!err) {
      res.send('ok')
    } else {
      res.send('fail')
    }
  })
})

module.exports = router;