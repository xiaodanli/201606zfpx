var setting =require('../setting');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var db = mongoose.connect(setting.dbUrl);
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("数据库连接成功");
});
mongoose.model('User',new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    avatar:{type:String,required:true}
}));
mongoose.model('Article',new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    createAt:{type:Date,default:Date.now},
    img:{type:String},
    user:{type:ObjectId,ref:'User'},//ref:主键
    comments:[
        {
            user:{type:ObjectId,ref:'User'},
            content:{type:String},
            createAt:{type:Date,default:Date.now}
    }],
    pv:{type:Number,default:0}
}));

global.Model = function (type) {
  return mongoose.model(type);
};