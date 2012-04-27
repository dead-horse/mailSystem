/*!
 * mailSys - app.js
 */

/**
 * Module dependencies.
 */
var config = require('./config');
var connect = require('connect');
var render = require('connect-render');
var RedisStore = require('connect-mredis')(connect);
var utils = require('./lib/utils');
var sign = require('./controllers/sign');
var home = require('./controllers/home');

var app = connect(
  connect.favicon(),
  connect.static(__dirname + '/public'),
  connect.query(),
  connect.cookieParser(),
  connect.session({
    secret: config.sessionSecret,
    cookie: {path:'/', httpOnly: true, maxAge: 3600000 * 24}
  }),
  connect.bodyParser(),
  connect.csrf(),
  render({
    root: __dirname + '/views',
    layout: 'layout.html',
    cache: !config.debug,
    helpers: {
      config: config
    }
  })
);

app.use('/sign/', sign.auth());
app.use('/sign/', connect.router(sign));

app.use('/', home.auth());
app.use('/', connect.router(home));

app.use(function(err, req, res, next) {
  var msg = {
    method: req.method,
    url: req.url,
    error: err.message
  };
  if (config.debug) {
    msg.stack = err.stack;
  }
  utils.sendJSON(res, 500, msg);
  err.url = req.url;
});

app.use(function(req, res, next) {
  utils.sendJSON(res, 404, {
    method: req.method,
    url: req.url,
    error: 'NotFound'
  });
});


app.listen(config.port);