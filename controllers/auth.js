var express = require('express'),
  router = express.Router(),
  _ = require('lodash');
User = require('../models/user');

module.exports = function(passport) {
  router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        res.send(err.message);
      } else if (!user) {
        res.send(info);
      } else {
        req.logIn(user, function(err) {
          if (err) {
            res.send(err.message);
          } else {
            sendDetail(req, res);
          }
        });
      }
    })(req, res, next);
  });

  router.post('/logout',
    function(req, res) {
      req.logout();
      res.send({
        logout: 'successful'
      });
    });

  return router;
};

function sendDetail(req, res) {
  var detail = {};
  var loggedUser = req.user;
  User.getGroup(loggedUser.userId).then(function(group) {
    detail = _.assign(req.user, {
      group: group
    });
    return User.getPrivilege(loggedUser.userId);
  }).then(function(privilege) {
    detail = _.assign(detail, privilege);
    res.send(_.omit(detail, ['userId', 'password']));
  }).catch(function(err) {
    res.status(500).send(err.message);
  });
}
