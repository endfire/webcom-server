import jwt from 'jsonwebtoken';

const secret = process.env.JWT_KEY;
const ALGORITHM = 'HS256';

/**
 * JWT Function to create token.
 *
 * @param {String} data - The data that is to be signed.
 * @return {Function}
 */
export default (data) => (
  new Promise((resolve, reject) => {
    jwt.sign(data, secret, { algorithm: ALGORITHM }, (err, token) => (
      err
        ? reject(err)
        : resolve(token)
    ));
  })
);
