import jwt from 'jsonwebtoken';
const secret = process.env.JWT_KEY;

/**
 * JWT Fucntion to create token.
 *
 * @param  {String}   id - ID of user.
 * @param  {Function} callback - Custom callback for create.
 * @return {Function}
 */
export default (id, callback) => jwt.sign(id, secret, callback);
