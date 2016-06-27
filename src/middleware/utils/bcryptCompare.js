import bcrypt from 'bcrypt';
import { NotAcceptable } from 'http-errors';

/**
 * Bcrypt function to compare password.
 *
 * @param {String} plaintextPassword - Plain text password.
 * @param {String} hashedPassword - Hashed password (from db).
 * @return {Function}
 */
export default (plaintextPassword, hashedPassword) => {
  if (!plaintextPassword || !hashedPassword) throw new NotAcceptable();

  return new Promise((resolve, reject) => {
    bcrypt.compare(plaintextPassword, hashedPassword, (err, res) => (
      err ? reject(new NotAcceptable()) : resolve(res)
    ));
  });
};
