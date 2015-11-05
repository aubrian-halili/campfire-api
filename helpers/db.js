var _ = require('lodash'),
  Promise = require('bluebird'),
  mysql = require('mysql'),
  conf = require('../config/conf'),
  logger = require('./logger');

var dbPool = mysql.createPool({
  host: conf.db.host,
  port: conf.db.port,
  user: conf.db.user,
  password: conf.db.password,
  database: conf.db.database
});

exports.getConnection = function() {
  return new Promise(function(resolve, reject) {
    dbPool.getConnection(function(err, connection) {
      if (err) {
        reject(errorHandler(err));
      } else {
        resolve(connection);
      }
    });
  });
};

exports.beginTransaction = function() {
  return new Promise(function(resolve, reject) {
    getConnection().then(function(connection) {
      connection.beginTransaction(function(err) {
        if (err) {
          reject(errorHandler(err));
        } else {
          resolve(connection);
        }
      });
    });
  });
};

exports.query = function(query, values, connection) {
  if (_.isNull(connection)) {
    return this.execQuery(query, values, connection);
  } else {
    return this.queryOnce(query, values);
  }
};

exports.execQuery = function(query, values, connection) {
  return new Promise(function(resolve, reject) {
    connection.query(query, values, function(err, result) {
      if (err) {
        reject(errorHandler(err));
      } else {
        resolve(result);
      }
    });
  });
};

exports.queryOnce = function(query, values) {
  var db = this;
  return new Promise(function(resolve, reject) {
    var conn = null;
    db.getConnection().then(function(connection) {
      conn = connection;
      return db.execQuery(query, values, conn);
    }).then(function(result) {
      resolve(result);
    }).catch(function(err) {
      reject(err);
    }).finally(function() {
      db.releaseConnection(conn);
    });
  });
};

exports.commitTransaction = function(connection) {
  return new Promise(function(resolve, reject) {
    connection.commit(function(err) {
      if (err) {
        reject(errorHandler(err));
      } else {
        resolve();
      }
    });
  });
};

exports.releaseConnection = function(connection) {
  if (!_.isNull(connection)) {
    connection.release();
  }
};

exports.rollbackTransaction = function(connection) {
  if (!_.isNull(connection)) {
    connection.rollback();
  }
};

exports.isAlive = function() {
  var db = this;
  return new Promise(function(resolve, reject) {
    var conn = null;
    db.getConnection().then(function(connection) {
      conn = connection;
      resolve(true);
    }).catch(function(err) {
      logger.error(err);
      resolve(false);
    }).finally(function() {
      db.releaseConnection(conn);
    });
  });
};

function errorHandler(err) {
  logger.error(err);
  return new Error('SQL error encountered.');
}
