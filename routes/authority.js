const express = require('express')
const mysql = require('mysql')
const router = express.Router()

router.get('/', function (req, res, next) {
  res.send("I'm authority response")
})

module.exports = router