import jwt from 'jsonwebtoken';
const secret = process.env.JWT_KEY;
import { Unauthorized, BadRequest } from 'http-errors';

/**
 * JWT Function to verify token.
 *
 * @param {String} ctx
 * @return {Function}
 */
export default token => {
  if (!token) return Promise.reject(new BadRequest());

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => (
       err ? reject(new Unauthorized()) : resolve(decoded)
    ));
  });
};
