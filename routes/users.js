var express = require('express');
//返回一个路由的实例
var router = express.Router();

/* GET users listing. */
//用户注册
router.get('/reg', function(req, res, next) {
  res.render('user/reg',{title:'用户注册'});
});
router.post('/reg', function(req, res, next) {
  res.redirect('/');
});
router.get('/login', function(req, res, next) {
  res.render('user/login',{title:'用户登录'});
});
router.post('/login', function(req, res, next) {
  res.redirect('/');
});
router.get('/logout', function(req, res, next) {
  res.redirect('/');
});
module.exports = router;
