var express = require('express'),
  router = express.Router();

router.use('/healthcheck', require('./healthchecks'));
router.use('/user', require('./user-essentials'));
router.use('/list', require('./lists'));
router.use('/api', require('./restrictions'));
router.use('/api/user', require('./users'));

module.exports = router;
