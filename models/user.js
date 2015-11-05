var _ = require('lodash'),
  Promise = require('bluebird'),
  db = require('../helpers/db'),
  util = require('../helpers/util'),
  bcrypt = require('../helpers/bcrypt'),
  validate = require('../helpers/validate'),
  redis = require('../helpers/redis'),
  mail = require('../helpers/mail'),
  param = require('../helpers/param'),
  conf = require('../config/conf');

exports.findOne = function(username) {
  return new Promise(function(resolve, reject) {
    var query = 'SELECT user_id userId, first_name firstName, last_name lastName, email, password, created, modified FROM user WHERE email = ? OR username = ?';
    var values = [username, username];

    db.query(query, values).then(function(rows) {
      var user = null;
      if (rows.length > 0) {
        user = _.first(rows);
      }
      resolve(user);
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.findById = function(userId) {
  return new Promise(function(resolve, reject) {
    var query = 'SELECT user_id userId, first_name firstName, last_name lastName, email, password, created, modified FROM user WHERE user_id = ?';
    var values = [userId];

    db.query(query, values).then(function(rows) {
      var user = null;
      if (rows.length > 0) {
        user = _.first(rows);
      }
      resolve(user);
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.add = function(users) {
  return new Promise(function(resolve, reject) {
    var query = 'INSERT INTO user (first_name, last_name, email, password, created, modified) VALUES ';
    var placeholder = '(?, ?, ?, ?, NOW(), NOW())';
    var values = [];
    _.forEach(users, function(user) {
      values = values.concat([user.firstName, user.lastName, user.email, user.password]);
    });

    placeholder = util.repeat(placeholder, users.length, ',');
    query = query.concat(placeholder);

    db.query(query, values).then(function(result) {
      resolve(result);
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.update = function(user) {
  return new Promise(function(resolve, reject) {
    var query = 'UPDATE user SET first_name=?, last_name=?, email=?, password=?, modified=NOW() WHERE user_id=?';
    var values = [user.firstName, user.lastName, user.email, user.password, user.userId];

    db.query(query, values).then(function(result) {
      resolve(result);
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.isEmailExist = function(username) {
  var User = this;
  return new Promise(function(resolve, reject) {
    User.findOne(username).then(function(user) {
      var isExist = false;
      if (!_.isNull(user)) {
        isExist = true;
      }
      resolve(isExist);
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.getGroup = function(userId) {
  return new Promise(function(resolve, reject) {
    var query = 'SELECT g.group_id groupId, name FROM user_group u_g LEFT JOIN groups g ON u_g.group_id = g.group_id WHERE user_id = ?';
    var values = [userId];

    db.query(query, values).then(function(rows) {
      resolve(rows);
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.getRole = function(userId) {
  return new Promise(function(resolve, reject) {
    var query = 'SELECT r.role_id roleId, r.name FROM user_group u_g LEFT JOIN groups g ON u_g.group_id = g.group_id LEFT JOIN group_role g_r ON g.group_id = g_r.group_id LEFT JOIN role r ON g_r.role_id = r.role_id WHERE u_g.user_id = ?';
    query = query + ' UNION SELECT r.role_id, r.name FROM user_role u_r LEFT JOIN role r ON u_r.role_id = r.role_id WHERE u_r.user_id = ? GROUP BY r.role_id';
    var values = [userId, userId];

    db.query(query, values).then(function(rows) {
      resolve(rows);
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.getPrivilege = function(userId) {
  var User = this;
  return new Promise(function(resolve, reject) {
    var data = {};
    User.getRole(userId).then(function(role) {
      data.role = role;
    }).then(function() {
      if (data.role.length > 0) {
        var roles = _.pluck(data.role, 'roleId').toString();
        var query = 'SELECT p.privilege_id privilegeId, p.name privilegeName FROM role_privilege r_p LEFT JOIN privilege p ON r_p.privilege_id = p.privilege_id WHERE r_p.role_id IN';
        query = query + ' (' + roles + ') GROUP BY p.privilege_id';
        return db.query(query, []);
      } else {
        return [];
      }
    }).then(function(privilege) {
      data.privilege = privilege;
      resolve(data);
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.hasRole = function(userId, roleId) {
  var User = this;
  return new Promise(function(resolve, reject) {
    User.getRole(userId).then(function(roles) {
      var hasRole = false;
      var role = _.find(roles, 'roleId', roleId);
      if (!_.isUndefined(role)) {
        hasRole = true;
      }
      resolve(hasRole);
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.hasPrivilege = function(userId, privilegeId) {
  var User = this;
  return new Promise(function(resolve, reject) {
    User.getPrivilege(userId).then(function(data) {
      var hasPrivilege = false;
      var privilege = _.find(data.privilege, 'privilegeId', privilegeId);
      if (!_.isUndefined(privilege)) {
        hasPrivilege = true;
      }
      resolve(hasPrivilege);
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.register = function(req) {
  var User = this;
  return new Promise(function(resolve, reject) {
    var account = {
      firstName: param.get(req, 'firstName'),
      lastName: param.get(req, 'lastName'),
      email: param.get(req, 'email'),
      password: param.get(req, 'password')
    };

    validate.register(account).then(function() {
      return User.isEmailExist(account.email);
    }).then(function(isExist) {
      if (isExist) {
        throw new Error('Email exist.');
      }
    }).then(function() {
      return bcrypt.hash(account.password);
    }).then(function(hash) {
      account.password = hash;
      return User.add([account]);
    }).then(function(result) {
      resolve(result);
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.forgot = function(req) {
  var User = this;
  return new Promise(function(resolve, reject) {
    var email = param.get(req, 'email');

    validate.forgot({
      email: email
    }).then(function() {
      return User.findOne(email);
    }).then(function(user) {
      if (!user) {
        throw new Error("We couldn't find your account with that information");
      }
      var uuid = util.generateUUID(user.userId);
      var data = _.assign(user, {
        uuid: uuid
      });

      // Store the UUID in Redis and set expiration
      redis.set(uuid, user.userId);
      redis.expire(uuid, conf.forgotPassword.expire);

      // Send email for Password Reset
      mail.sendTemplate(data.email, 'Reset Password', 'forgot-password', data);
      resolve();
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.reset = function(req) {
  var User = this;
  return new Promise(function(resolve, reject) {
    var account = null;
    var data = {
      ref: param.get(req, 'ref'),
      password: param.get(req, 'password')
    };

    validate.reset(data).then(function() {
      return redis.get(data.ref);
    }).then(function(userId) {
      if (!userId) {
        throw new Error('Session invalid');
      }
      return User.findById(userId);
    }).then(function(user) {
      account = user;
      return bcrypt.hash(data.password);
    }).then(function(hash) {
      account.password = hash;
      return User.update(account);
    }).then(function(result) {
      // Delete the UUID in Redis
      redis.del(data.ref);

      resolve(result);
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.detail = function(userId) {
  var User = this;
  return new Promise(function(resolve, reject) {
    var query = 'SELECT profile_picture profilePicture FROM user WHERE user_id = ?';
    var values = [userId];

    db.query(query, values).then(function(rows) {
      var detail = null;
      if (rows.length > 0) {
        detail = _.first(rows);
      }
      resolve(detail);
    }).catch(function(err) {
      reject(err);
    });
  });
};
