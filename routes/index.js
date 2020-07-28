const express = require('express');
const router = express.Router();
const createconn = require('../public/js/mysql').createConn

router.get('/', function(req, res, next) {
  res.send('haahahahah')
});

module.exports = router;
