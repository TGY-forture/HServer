const express = require("express");
const createconn = require("../public/js/mysql").createConn;
let router = express.Router();

router.get("/", function (req, res, next) { //可以做限流优化(浏览器端)
  let code;
  do {
    code = (Math.random() * 10000).toFixed();
  } while (code.length != 4);
  res.json(code);
});

router.post("/", (req, res, next) => {
  let data = req.body;
  let connection = createconn();
  let sql = `SELECT username FROM usertab WHERE username='${data.phone}'`;
  new Promise((reslove, reject) => {
    connection.query(sql, (err, results, fields) => {
      if (!err && results.length > 0) {
        connection.end()
        reject("same");
      } else {
        reslove();  //默认不会出错,毕竟就一条查询语句而已 ^_^
      }
    });
  })
    .then(() => {
      sql = `INSERT INTO usertab (username,password,email,nickname) 
             VALUES ('${data.phone}','${data.password}','${data.email}','${data.nickname}')`;
      connection.query(sql, function (err, results, fields) {
        connection.end();
        if (!err) {
          res.send("success");
        } else {
          res.send("fail");
        }
      });
    })
    .catch((val) => {
      res.send(val);
    });
});

module.exports = router;
