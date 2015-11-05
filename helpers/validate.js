var validate = require('validate.js'),
  _ = require('lodash'),
  moment = require('moment'),
  Promise = require('bluebird');

validate.moment = moment;
validate.Promise = Promise;

exports.register = function(attributes) {
  return execute(attributes, require('./validations/register-constraints'));
};

exports.forgot = function(attributes) {
  return execute(attributes, require('./validations/forgot-constraints'));
};

exports.reset = function(attributes) {
  return execute(attributes, require('./validations/reset-constraints'));
};

exports.id = function(attributes) {
  return execute(attributes, require('./validations/id-constraints'));
};

function execute(attributes, constraint) {
  return new Promise(function(resolve, reject) {
    validate.async(attributes, constraint).then(function(data) {
      resolve();
    }).catch(function(err) {
      var error = 'Invalid values ';
      error = error.concat(_.keys(err).toString());
      error = error.concat('.');
      reject(new Error(error));
    });
  });
}
