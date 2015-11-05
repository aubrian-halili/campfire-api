var multer = require('multer'),
  conf = require('../config/conf');

exports.array = function(req, res, file) {
  var upload = multer().array(file);

  return new Promise(function(resolve, reject) {
    upload(req, res, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(req.files);
      }
    });
  });
};
