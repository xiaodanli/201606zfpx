var express = require('express');
var markdown = require('markdown').markdown;
//生成一个路由的实例，用来捕获访问主页的get请求
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/articles/list/1/2')
});
module.exports = router;
