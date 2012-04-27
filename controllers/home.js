/*!
 * mailSys - controllers/home.js
 */

/**
 * Module dependencies.
 */
var config = require('../config');
var EventProxy = require('EventProxy.js');
var user = require('../models').user;
var utils = require('../lib/utils');

exports = module.exports = function(app) {
  app.get('/', homePage);
  app.get('/list', listPage);
}

function homePage(req, res, next) {
  res.render('home.html', {layout: false});
}

function listPage(req, res, next) {
  res.render('list.html', {layout: false});
}

exports.auth = function() {
  return function(req, res, next) {
    if (!req.session || !req.session.user) {
      return utils.redirect(res, '/sign/login', 302);
    }
    user.findOne({name: req.session.user}, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return utils.redirect(res, '/sign/login', 302);
      }
      next();
    });
  }
}