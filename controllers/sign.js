/*!
 * mailSys - controllers/sign.js
 */

/**
 * Module dependencies.
 */
var config = require('../config');
var EventProxy = require('EventProxy.js');
var user = require('../models').user;
var utils = require('../lib/utils');
var pswSecret = config.pswSecret;

exports = module.exports = function(app) {
  app.get('/login', loginPage);
  app.get('/regist', registPage);
  app.post('/login.do', handleLogin);
  app.post('/regist.do', handleRegist);
  app.get('/logout', handleLogout);
}

function loginPage(req, res, next) {
  res.render('sign/login.html', {
    layout: 'signLayout.html',
    redirectUrl: req.query.ref|| '',
    warn: '',
  });
}

function registPage(req, res, next) {
  res.render('sign/regist.html', {
    layout: 'signLayout.html'
  })
}

function handleLogin(req, res, next) {
  var name = req.body.name || '';
  var pwd = req.body.pwd || '';
  var ref = req.body.redirectUrl || '';
  var autoLogin = req.body.remeber_me||'';
  if (!name) {
    return next(new Error('请输入用户名'));
  }
  if (!pwd) {
    return next(new Error('请输入密码'));
  }
  user.findOne({name: name, password: utils.md5(pswSecret + pwd + pswSecret)}, function(err, data) {
    if (err)　{
      return next(err);
    }
    if (!data) {
      return next(new Error('用户名或密码错误'));
    }
    if (autoLogin) {
      var timeOut = config.sessionTimeOut;
      req.session.cookie.expires = new Date(Date.now() + timeOut);
      req.session.cookie.maxAge = timeOut;
    }
    req.session.user = name;
    utils.redirect(res, ref && ref[0] === '/' ? ref : '/');
  })
}

function handleRegist(req, res, next) {
  var name = req.body.newUserName || '';
  var pass = req.body.newPassword || '';
  var con = req.body.passwordCon || '';
  if (!name) {
    return next(new Error('请输入用户名'));
  }
  if (!pass) {
    return next(new Error('请输入密码'));
  }
  if (pass !== con) {
    return next(new Error('两次密码输入不相同'));
  }
  user.newUser({name: name, password: utils.md5(pswSecret + pass + pswSecret)}, function(err) {
    if (err) {
      return next(err);
    } 
    req.session.user = name;
    utils.redirect(res, '/', 302);
  });
}

function handleLogout(req, res, next) {
  req.session.destroy(function(err){});
}
exports.auth = function() {
  return function(req, res, next) {
    if (req.url.indexOf('/logout') === 0) {
      next();
    }
    if (req.session && req.session.user) {
      user.findOne({name: req.session.user}, function(err, data) {
        if (err) {
          return next(err);
        }
        if (data) {
          return utils.redirect(res, '/', 302);
        }
        next();
      })
    } else {
      next();
    }
  }
}