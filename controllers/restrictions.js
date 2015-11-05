var express = require('express'),
  router = express.Router(),
  _ = require('lodash'),
  User = require('../models/user'),
  Const = require('../helpers/const'),
  AuthError = require('../helpers/error/auth-error');

router.all('*', function(req, res, next) {
  if (_.isUndefined(req.user)) {
    res.status(403).send('Unauthorize Access');
  } else {
    next();
  }
});

router.post('/user', function(req, res, next) {
  var loggedUser = req.user;
  User.hasPrivilege(loggedUser.userId, Const.Privilege.ADD_USER).then(function(hasPrivilege) {
    if (!hasPrivilege) {
      throw new AuthError('Unauthorize Access');
    }
    next();
  }).catch(AuthError, function(err) {
    res.status(403).send(err.message);
  }).catch(function(err) {
    res.status(400).send(err.message);
  });
});

module.exports = router;
