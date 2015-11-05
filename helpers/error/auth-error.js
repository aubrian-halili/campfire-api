function AuthError(message) {
  this.name = 'AuthError';
  this.message = (message || '');
}
AuthError.prototype = Object.create(Error.prototype);

module.exports = AuthError;
