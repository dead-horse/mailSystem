module.exports = {
  port: 1991,
  sessionSecret: 'input_your_session_secret',
  sessionTimeOut: 1000 * 60 * 60 * 24 * 14,
  pswSecret: 'input_your_psw_secret',
  debug: false,
  staticVersion: '0.0.1',
  site_name: '邮件收发系统',

  mongoUrl: 'localhost:27017/mailsystem',
};