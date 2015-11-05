var _ = require('lodash'),
  Promise = require('bluebird'),
  db = require('../helpers/db');

exports.get = function() {
  return new Promise(function(resolve, reject) {
    var query = 'SELECT sla_id slaId, sla FROM sla';
    var values = [];

    db.query(query, values).then(function(rows) {
      resolve(rows);
    }).catch(function(err) {
      reject(err);
    });
  });
};
