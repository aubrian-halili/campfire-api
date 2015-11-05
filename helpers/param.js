var _ = require('lodash'),
  date = require('./date'),
  hash = require('./hash');

exports.get = function(req, name, def) {
  var val = null;
  if (_.has(req.params, name)) {
    val = _.get(req.params, name);
  } else {
    val = _.get(req.query, name);
  }
  if (_.isEmpty(val)) {
    if (_.isEmpty(def)) {
      def = null;
    }
    val = def;
  }
  return val;
};

exports.getDate = function(req, name, def) {
  var Param = this;
  var val = Param.get(req, name, def);
  val = date.convert(val, 'DD/MM/YYYY');
  if (_.isNull(val)) {
    if (_.isEmpty(def)) {
      def = null;
    }
    val = def;
  }
  return val;
};

exports.decode = function(req, name) {
  var Param = this;
  var decoded = null;
  var val = Param.get(req, name);
  if (!_.isEmpty(val)) {
    var ids = [];
    _.forEach([].concat(val), function(item) {
      ids = ids.concat(hash.decode(item));
    });

    if (ids.length === 1) {
      decoded = _.first(ids);
    } else if (ids.length > 1) {
      decoded = ids;
    }
  }
  return decoded;
};
