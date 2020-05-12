var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/tgy', (req, res, next) => {
  res.render('index', { title: 'TGY' })
})
module.exports = router;
