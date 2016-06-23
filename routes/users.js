var express = require('express');
//返回一个路由的实例
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/hello', function(req, res, next) {
  res.send('respond with a resource hellos');
});

module.exports = router;
