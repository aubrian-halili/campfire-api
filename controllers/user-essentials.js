var express = require('express'),
  router = express.Router(),
  User = require('../models/user');

router.post('/signup', function(req, res) {
  User.register(req).then(function(result) {
    res.send('Registration successful');
  }).catch(function(err) {
    res.status(400).send(err.message);
  });
});

router.post('/forgot', function(req, res) {
  User.forgot(req).then(function(result) {
    res.send('Password reset sent');
  }).catch(function(err) {
    res.status(400).send(err.message);
  });
});

router.post('/reset', function(req, res) {
  User.reset(req).then(function(result) {
    res.send('Password reset successful');
  }).catch(function(err) {
    res.status(400).send(err.message);
  });
});

module.exports = router;
