import bcrypt from 'bcrypt';
const saltRounds = 10;

/**
 * Bcrypt Function to hash password.
 *
 * @param {String} password - Plain text password.
 * @return {Function}
 */
export default password => {
  if (!password) {
    return Promise.reject({
      message: 'Password undefined in bcrypt hash.',
    });
  }

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => (
      err
        ? reject(err)
        : resolve(hash)
    ));
  });
};
