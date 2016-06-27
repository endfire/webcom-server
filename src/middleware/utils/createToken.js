import jwt from 'jsonwebtoken';
const secret = process.env.JWT_KEY;
import { BadRequest } from 'http-errors';

/**
 * JWT Function to create token.
 *
 * @param {String} id - ID of user.
 * @param {Function} callback - Custom callback for create.
 * @return {Function}
 */
export default id => (
  new Promise((resolve, reject) => {
    jwt.sign(id, secret, { algorithm: 'HS256' }, (err, token) => (
      err ? reject(new BadRequest()) : resolve(token)
    ));
  })
);
