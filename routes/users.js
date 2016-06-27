var express = require('express');
//返回一个路由的实例
var router = express.Router();
var auth = require('../auth');

/* GET users listing. */
//用户注册
router.get('/reg',auth.mustNotLogin,function(req, res, next) {
  res.render('user/reg',{title:'用户注册'});
});
router.post('/reg',auth.mustNotLogin, function(req, res, next) {
  var user = req.body;
  /*{ username: '13699118512',
      email: 'dandan580826@163.com',
      password: '1',
      repassword: '1'
    }*/
  if(user.password != user.repassword){
     req.flash('error','密码输入不一致');
     return res.redirect('back');
  }
  delete user.repassword;
  console.log(user);
  user.password = blogUtil.md5(user.password);
  console.log(user);
  user.avatar = "https://secure.gravatar.com/avatar/"+blogUtil.md5(user.email)+"?s=48";
  new Model('User')(user).save(function (err,docs) {
      if(err){
          req.flash('error','注册用户失败');
          console.log(err);
          return res.redirect('back');
      }else{
          req.session.user = docs;
          req.flash('success','注册成功');
          //req.flash('success','欢迎光临');
          /*['success':['注册成功','欢迎光临']]*/
          res.redirect("/");

      }
  });
});
router.get('/login',auth.mustNotLogin,function(req, res, next) {
  res.render('user/login',{title:'用户登录'});
});
router.post('/login',auth.mustNotLogin, function(req,res, next) {
  console.log(req.body);
  var user = req.body;
  if(req.body.username != '' && req.body.password != ''){
      console.log(req.body);
      //res.redirect('/');
      user.password = blogUtil.md5(user.password);
      Model('User').find({username:user.username,password:user.password},function (err,doc) {
          console.log(doc);
          if(doc.length == 1){
              req.session.user = doc;
              req.flash('success','登录成功');
              res.redirect('/');
          }else{
              req.flash('error','用户名或密码有误');
              console.log(err);
              return res.redirect('back');
          }
      })
  }else{
      req.flash('error','填写数据不完全');
      return res.redirect('back');
  }

});
router.get('/logout',auth.mustLogin,function(req, res, next) {
    req.session.user = null;
    res.redirect('/');
});
module.exports = router;
