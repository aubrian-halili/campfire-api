var bcrypt = require('bcrypt'),
  Promise = require('bluebird'),
  conf = require('../config/conf');

exports.hash = function(data) {
  return new Promise(function(resolve, reject) {
    bcrypt.hash(data, conf.bcrypt.salt, function(err, encrypted) {
      if (err) {
        reject(err);
      } else {
        resolve(encrypted);
      }
    });
  });
};

exports.compare = function(data, encrypted) {
  return new Promise(function(resolve, reject) {
    bcrypt.compare(data, encrypted, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
