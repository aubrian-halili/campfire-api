var express = require('express'),
  router = express.Router(),
  User = require('../models/user');

router.get('/detail', function(req, res) {
  var loggedUser = req.user;
  User.detail(loggedUser.userId).then(function(detail) {
    res.send(detail);
  }).catch(function(err) {
    res.status(400).send(err.message);
  });
});

module.exports = router;
