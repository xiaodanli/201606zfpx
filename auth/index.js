/**
 * Created by dandan on 16-6-27.
 */
//检查必须登录  不登录就调到登录页
exports.mustLogin = function (req,res,next) {
    if(req.session.user){
        next();
    }else{
        req.flash('error','您尚未登录,请登录');
        res.redirect('/users/login');
    }
};
exports.mustNotLogin = function (req,res,next) {
  if(req.session.user){
      req.flash('error','您已经登录了');
      res.redirect('/');
  }else{
        next();
  }
};