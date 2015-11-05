var Hashids = require('hashids'),
  _ = require('lodash'),
  conf = require('../config/conf');

var hash = new Hashids(conf.hash.salt);

exports.decode = function(id) {
  return hash.decode(id);
};

exports.encode = function(id) {
  return hash.encode(id);
};

exports.encodeProperty = function(data, propertyList) {
  var Hash = this;
  _.forEach(data, function(value, key) {
    if (_.includes(propertyList, key)) {
      data[key] = Hash.encode(value);
    }
    if (_.isObject(value)) {
      Hash.encodeProperty(value, propertyList);
    }
  });
  return data;
};
