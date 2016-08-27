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
  const { header } = request;
  const userType = header['user-type'];

  if (!userType) return Promise.reject('The \'user-type\' header is not defined.');

  const handleVerifyUser = user => {
    request.body = user;
    return request.body;
  };

  const handleDecodedToken = token => ({
    id: token.id,
    type: userType,
  });

  const verifyError = err => Promise.reject(err);

  return verifyToken(request.body.token)
    .then(handleDecodedToken)
    .then(fetchUser)
    .then(handleVerifyUser)
    .catch(verifyError);
};
