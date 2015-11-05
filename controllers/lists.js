var express = require('express'),
  router = express.Router(),
  Sla = require('../models/sla');

router.get('/sla', function(req, res) {
  Sla.get().then(function(rows) {
    res.send(rows);
  }).catch(function(err) {
    res.status(400).send(err.message);
  });
});

module.exports = router;
