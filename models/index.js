/**
 * models/index.js
 */

/**
 * Module dependencies
 */
var mongo = require('mongoskin');
var config = require('../config');

var db = exports.db = mongo.db(config.mongoUrl);
var empty = function() {};
var user = exports.user = exports.db.collection('user');
user.ensureIndex({'name': 1}, {unique: true}, empty);

db.bind('user', {
  newUser: function(options, fn) {
    this.findOne({name: options.name}, function(err, user) {
      if (err) return fn(err);
      if (user) return fn(new Error('用户名已存在'));
      this.save(options, fn);
    }.bind(this));
  }
})