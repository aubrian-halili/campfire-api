var moment = require('moment');

exports.convert = function(dateString, format) {
  var value = null;
  if (moment(dateString, format).isValid()) {
    value = moment.utc(dateString, format).toDate();
  }
  return value;
};

exports.isDate = function(value) {
  return moment.isDate(value);
};

exports.getFiscalQuarter = function(date) {
  var result = {};
  var adjustedDate = null;
  var nextYear = null;
  var startMonth = 7; // Default is July

  if (startMonth > 1) {
    adjustedDate = date.subtract(startMonth - 1, 'months');
    nextYear = adjustedDate.clone().add(1, 'years');
  } else {
    adjustedDate = moment;
  }

  result.quarter = Math.ceil((adjustedDate.month() + 1.0) / 3.0);
  result.year = adjustedDate.year();
  result.nextYear = (nextYear) ? nextYear.year() : nextYear;
  return result;
};
