var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('../models/user'),
  bcrypt = require('../helpers/bcrypt');

passport.use(new LocalStrategy(
  function(username, password, done) {
    return new Promise(function(resolve, reject) {
      User.findOne(username).then(function(user) {
        if (!user) {
          done(null, false, {
            message: 'Incorrect username.'
          });
        } else {
          bcrypt.compare(password, user.password).then(function(result) {
            if (result) {
              done(null, user);
            } else {
              done(null, false, {
                message: 'Incorrect password.'
              });
            }
          }).catch(function(err) {
            done(err);
          });
        }
      }).catch(function(err) {
        done(err);
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.userId);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user) {
    done(null, user);
  }).catch(function(err) {
    done(err);
  });
});

module.exports = passport;
