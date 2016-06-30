var express = require('express');
var path = require('path');//处理路径
var favicon = require('serve-favicon');//处理收藏夹图标的
var logger = require('morgan');//处理日志
var cookieParser = require('cookie-parser');//chuli cookie req.cookie  req.cookies
var bodyParser = require('body-parser');//解析请求体
var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);//会话绑到数据库
var routes = require('./routes/index');//根路由
var users = require('./routes/users');//用户路由
var articles = require('./routes/articles');//用户路由
var setting = require('./setting');
var flash = require('connect-flash');
var multer = require('multer');
var markdown = require('markdown').markdown;
require("./util");
require("./db/index");
var app = express();//生成一个express实例app


app.set('views', path.join(__dirname, 'views'));//设置视图模板的存放路径
// view engine setup  设置引擎
app.set('view engine','html');
app.engine('html',require('ejs').__express);//设置对html文件的渲染

/*
 app.set('view engine', 'ejs');//设置模板引擎
*/
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));//设置/public/favicon.ico为favicon图标
//
app.use(logger('dev'));//加载日志中间件   
app.use(bodyParser.json());//加载解析json的中间件  
app.use(bodyParser.urlencoded({ extended: false }));//加载解析urlencoded请求的中间件 
app.use(cookieParser());//加载解析cookie的中间件
app.use(session({
  secret:'zfpxblog',
  saveUninitialized:true,
  resave:true,
  store:new MongoStore({url:setting.dbUrl})
}));
app.use(flash());
app.use(function (req,res,next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});
app.use(express.static(path.join(__dirname, 'public')));//设置public文件夹为存放静态文件的目录


app.use('/', routes);
app.use('/users', users);
app.use('/articles', articles);
// catch 404 and forward to error handler
//捕获404错误并且转发到错误处理中间件
app.use(function(req, res, next) {
  res.status(err.status || 404);
  res.render('404');
});

// error handlers

// development error handler  开发环境
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);//设置相应的代码
    res.render('error', {//渲染模板  模板文件  参数数据
      message: err.message,
      error: err
    });
  });
}

// production error handler   生产环境
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

