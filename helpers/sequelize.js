var _ = require('lodash'),
  Sequelize = require('sequelize'),
  Promise = require('bluebird'),
  conf = require('../config/conf'),
  logger = require('./logger');

var sequelize = new Sequelize(conf.db.database, conf.db.user, conf.db.password, {
  host: conf.db.host,
  port: conf.db.port,
  define: {
    timestamps: false
  }
});
