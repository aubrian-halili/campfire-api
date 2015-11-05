var fs = require('fs'),
  _ = require('lodash'),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport'),
  Handlebars = require('handlebars'),
  conf = require('../config/conf'),
  logger = require('./logger');

var transporter = nodemailer.createTransport(smtpTransport({
  host: conf.mail.host,
  port: conf.mail.port,
  auth: {
    user: conf.mail.auth.user,
    pass: conf.mail.auth.password
  }
}));

exports.send = function(to, subject, html, opt) {
  // opt for additional configurations
  var mailOpt = _.assign({
    from: conf.mail.sender,
    to: to,
    subject: subject,
    html: html
  }, opt);
  transporter.sendMail(mailOpt, function(err, info) {
    if (err) {
      logger.error(err);
    } else {
      logger.info(info);
    }
  });
};

exports.sendTemplate = function(to, subject, template, data, opt) {
  var Mail = this;
  Mail.loadTemplate(template, data).then(function(html) {
    Mail.send(to, subject, html, opt);
  }).catch(function(err) {
    logger.error(err);
  });
};

exports.loadTemplate = function(name, data) {
  return new Promise(function(resolve, reject) {
    var path = __dirname + '/mail-template/' + name + '.html';
    fs.readFile(path, function(err, content) {
      if (err) {
        reject(err);
      } else {
        // Include frequently use values
        data = _.assign({
          serverUrl: conf.serverUrl
        }, data);
        var template = Handlebars.compile(content.toString());
        resolve(template(data));
      }
    });
  });
};
