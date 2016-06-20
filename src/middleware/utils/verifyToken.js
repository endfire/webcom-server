import jwt from 'jsonwebtoken';
const secret = process.env.JWT_KEY;

/**
 * JWT Function to verify token.
 *
 * @param {String} ctx
 * @return {Function}
 */
export default token => {
  if (!token) return Promise.reject();

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => (
       err ? reject(err) : resolve(decoded)
    ));
  });
};
