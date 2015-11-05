var winston = require('winston'),
  conf = require('../config/conf');
winston.emitErrs = true;

var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    }),
    new(winston.transports.File)({
      level: conf.logger.level,
      filename: './logs/all-logs.log',
      handleExceptions: true,
      json: true,
      colorize: false
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};
