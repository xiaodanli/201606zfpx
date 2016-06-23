/**
 * Created by dandan on 16-6-23.
 */
var express = require('express');
//返回一个路由的实例
var router = express.Router();

router.get('/add', function(req, res, next) {
    res.render('article/add',{title:'发表文章'});
});
router.post('/add', function(req, res, next) {
    res.redirect('/');
});
module.exports = router;
