/* eslint-disable no-param-reassign */
import { verifyToken } from '../../../utils/';
import { fetchUser } from '../utils/';

/**
 * Authenticate the user.
 *
 * @param  {Object} ctx
 * @param  {Function} next
 * @return {Function}
 */
export default (request) => {
  const handleVerifyUser = user => {
    delete user.password;
    request.body = user;
    return request.body;
  };

  const verifyError = err => Promise.reject(err);

  return verifyToken(request.body.token)
    .then(fetchUser)
    .then(handleVerifyUser)
    .catch(verifyError);
};
