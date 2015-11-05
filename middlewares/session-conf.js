var session = require('express-session'),
  RedisStore = require('connect-redis')(session),
  redis = require('../helpers/redis'),
  conf = require('../config/conf');

module.exports = session({
  store: new RedisStore(conf.redis),
  secret: conf.session.secret,
  resave: conf.session.resave,
  saveUninitialized: conf.session.saveUninitialized
});
