var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  morgan = require('morgan'),
  session = require('./middlewares/session-conf'),
  passport = require('./middlewares/passport-conf'),
  logger = require('./helpers/logger'),
  conf = require('./config/conf'),
  port = process.env.PORT || conf.port;

// For CORS implementations
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(morgan(conf.logger.format, {
  'stream': logger.stream
}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.use(require('./controllers/auth')(passport));
app.use(require('./controllers'));

app.listen(port, function() {
  logger.info('Listening on port ' + port);
});
