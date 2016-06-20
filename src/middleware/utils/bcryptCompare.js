import bcrypt from 'bcrypt';

/**
 * Bcrypt function to compare password.
 *
 * @param {String} plaintextPassword - Plain text password.
 * @param {String} hashedPassword - Hashed password (from db).
 * @return {Function}
 */
export default (plaintextPassword, hashedPassword) => {
  if (!plaintextPassword || !hashedPassword) return Promise.reject();

  return new Promise((resolve, reject) => {
    bcrypt.compare(plaintextPassword, hashedPassword, (err, res) => (
      err ? reject(err) : resolve(res)
    ));
  });
};
