var _ = require('lodash');

var config = {
  port: 4000,
  serverUrl: 'https://localhost:5000',
  db: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'admin',
    database: 'campfire_db'
  },
  session: {
    secret: 'campfire',
    resave: false,
    saveUninitialized: false
  },
  logger: {
    format: 'tiny',
    level: 'info'
  },
  bcrypt: {
    salt: 10
  },
  hash: {
    salt: 'yPXbzKQj'
  },
  mail: {
    sender: '',
    host: '',
    port: 587,
    auth: {
      user: '',
      password: ''
    }
  },
  forgotPassword: {
    expire: 28800
  },
  uploadDir: '/data/campfire'
};

if (process.env.NODE_ENV && process.env.NODE_ENV === 'stage') {
  config = _.assign(config, {
    logger: {
      format: 'tiny',
      level: 'info'
    }
  });
}

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  config = _.assign(config, {
    logger: {
      format: 'tiny',
      level: 'info'
    }
  });
}

module.exports = config;
