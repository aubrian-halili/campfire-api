var express = require('express'),
  router = express.Router(),
  db = require('../helpers/db'),
  redis = require('../helpers/redis'),
  logger = require('../helpers/logger');

router.get('/', function(req, res) {
  var isDBAlive = 0;
  var isRedisAlive = 0;
  db.isAlive().then(function(status) {
    if (status === true) {
      isDBAlive = 1;
    }
    return redis.isAlive();
  }).then(function(status) {
    if (status === true) {
      isRedisAlive = 1;
    }
  }).catch(function(err) {
    logger.error(err);
  }).finally(function() {
    res.send({
      'status': {
        'db': isDBAlive,
        'redis': isRedisAlive
      }
    });
  });
});

router.get('/alive', function(req, res) {
  res.send('Alive and kicking');
});

module.exports = router;
