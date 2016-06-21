import bcrypt from 'bcrypt';
import { NotAcceptable } from 'http-errors';
const saltRounds = 10;

/**
 * Bcrypt Function to hash password.
 *
 * @param {String} password - Plain text password.
 * @return {Function}
 */
export default password => {
  if (!password) return Promise.reject(new NotAcceptable());

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => (
      err ? reject(err) : resolve(hash)
    ));
  });
};
