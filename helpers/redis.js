var redis = require('redis'),
  Promise = require('bluebird'),
  conf = require('../config/conf'),
  logger = require('./logger');

var client = redis.createClient(conf.redis.port, conf.redis.host);

exports.set = function(key, value) {
  client.set(key, value, function(err, info) {
    if (err) {
      logger.error(err);
    } else {
      logger.info('Redis Set %s Status: %s', key, info);
    }
  });
};

exports.get = function(key) {
  return new Promise(function(resolve, reject) {
    client.get(key, function(err, value) {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    });
  });
};

exports.expire = function(key, time) {
  client.expire(key, time, function(err, info) {
    if (err) {
      logger.error(err);
    } else {
      logger.info('Redis Expire %s %d seconds Status: %s', key, time, info);
    }
  });
};

exports.del = function(keys) {
  client.del(keys, function(err, info) {
    if (err) {
      logger.error(err);
    } else {
      logger.info('Redis Del %j Status: %s', keys, info);
    }
  });
};

exports.isAlive = function() {
  var Redis = this;
  return new Promise(function(resolve, reject) {
    Redis.get('test').then(function(value) {
      resolve(true);
    }).catch(function(err) {
      logger.error(err);
      resolve(false);
    });
  });
};
