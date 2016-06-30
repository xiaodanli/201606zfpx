/**
 * Created by dandan on 16-6-23.
 */
var express = require('express');
var auth = require('../auth');
var multer = require('multer');
var path = require('path');
var markdown = require('markdown').markdown;
var async = require('async');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({ storage: storage });
//返回一个路由的实例
var router = express.Router();
router.get('/list/:pageNum/:pageSize',auth.mustLogin,function(req, res, next) {
    var pageNum = parseInt(req.params.pageNum);
    var pageSize = parseInt(req.params.pageSize);
    var query = {};
    if(req.query.keyword) {
        query['title'] = new RegExp(req.query.keyword, 'i');
    }
    Model('Article').count(query,function (err,count) {
        Model('Article').find(query).skip((pageNum-1)*pageSize).limit(pageSize).sort({createAt:-1}).populate('user').populate('comments.user').exec(function (err,articles) {
            if(articles.length == 0){
                articles.nonCon = '没有相关的内容';
            }
            articles.forEach(function (article) {
                article.content = markdown.toHTML(article.content);
            });
            res.render('index', {
                articles:articles,
                keyword: req.query.keyword,
                pageNum:pageNum,
                pageSize:pageSize,
                totalPage:Math.ceil(count/pageSize)
            });
        });
    });
});
router.get('/add',auth.mustLogin,function(req, res, next) {
    res.render('article/add',{article:{},keyword:''});
});
router.post('/add',auth.mustLogin,upload.single('img'),function(req, res, next) {
    //判断是修改还是添加
    var article = req.body;
    var id = req.body.id;
    if(req.file){
        article.img = path.join('/uploads',req.file.filename);
    }
    if(id){//修改
        var update = {
            title:article.title,
            content:article.content
        };
        if(article.img){
            update.img = article.img
        }
        Model('Article').findByIdAndUpdate(id,{$set:update},function (err,doc) {
            if(err){
                req.flash('error','更新文章失败');
            }else{
                req.flash('success','文章更新成功');
                res.redirect('/articles/detail/'+ id);
            }
        });
    }else{ //添加
        var user = req.session.user;
        console.log(user.length == 1);
        if(user.length && user.length == 1){
            article.user = user[0]._id;
        }else{
            article.user = user._id;
        }
        console.log(article);
        new Model('Article')(article).save(function (err,article) {
            if(err){
                req.flash('error','文章发表失败');
                return res.redirect('back');
            }else{
                req.flash('success','文章发表成功');
                res.redirect('/');
            }
        });
    }
});
router.get('/detail/:_id',function(req, res, next) {
    var id = req.params._id;
    async.parallel([function (callback) {
        Model('Article').findOne({_id:id}).populate('user').populate('comments.user').exec(function(err,article){
            article.content = markdown.toHTML(article.content);
            callback(err,article);
        });
    },function (callback) {
        Model('Article').update({_id:req.params._id},{$inc:{pv:1}},callback);
    }],function (err,result) {
        if(err){
            req.flash('error',err);
            res.redirect('back');
        }else{
            res.render('article/detail',{article:result[0],keyword:''})
        }
    })
});
router.get('/edit/:_id',function(req, res, next) {
    var id = req.params._id;
    Model('Article').findById(id,function (err,article) {
        if(err && !article){
            req.flash('error','文章不存在');
            return res.redirect('back');
        }else{
            res.render('article/add',{article:article,keyword:''});
        }
    });
});
router.get('/del/:_id',function(req, res, next) {
    var _id = req.params._id;
    Model('Article').findByIdAndRemove(_id,function (err,result) {
        if(err){
            req.flash('error','删除文章失败');
            return res.redirect('back');
        }else{
            res.redirect('/');
        }
    });
});

router.post('/comment',auth.mustLogin,function (req,res) {
    var user = req.session.user;
    if(user.length && user.length == 1){
        user._id = user[0]._id;
    }else{
        user._id = user._id;
    }
    Model('Article').update({_id:req.body.id},{$push:{comments:{
        user:user._id,content:req.body.content
    }}},function (err,result) {
       if(err){
           req.flash('error',err);
           return res.redirect('back');
       }else{
           req.flash('success','评论成功!');
           res.redirect('back');
       }
    });
});
module.exports = router;
