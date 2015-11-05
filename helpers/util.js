var _ = require('lodash'),
  Promise = require('bluebird'),
  hash = require('./hash'),
  csvParse = require('csv-parse');

exports.repeat = function(string, count, separator) {
  string = string.concat(separator);
  string = _.repeat(string, count);
  string = _.trim(string, separator);
  return string;
};

exports.flatten = function(list) {
  var values = [];
  _.forEach(list, function(obj) {
    values = values.concat(_.values(obj));
  });
  return values;
};

exports.getRandomInt = function(min, max) {
  var randomInt = null;
  var start = 0;
  var end = 100;
  if (_.isNumber(min)) {
    start = min;
  }
  if (_.isNumber(max)) {
    end = max;
  }
  randomInt = Math.floor(Math.random() * (end - start)) + start;
  return randomInt;
};

exports.generateUUID = function(uniqueId) {
  var ramdomInt = _.padLeft(this.getRandomInt(0, 1000), 4, '0');
  var timestamp = Math.floor(new Date() / 1000);
  var uuid = timestamp + uniqueId + ramdomInt;
  uuid = hash.encode(parseInt(uuid));
  return uuid;
};

exports.parseCsv = function(data) {
  return new Promise(function(resolve, reject) {
    csvParse(data, function(err, output) {
      if (err) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
};

exports.bufferToString = function(buff) {
  return new Promise(function(resolve) {
    var data = buff.toString('utf8');
    resolve(data);
  });
};
