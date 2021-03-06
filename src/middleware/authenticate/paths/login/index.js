/* eslint-disable no-param-reassign */
import { createToken, bcryptCompare } from '../../../utils/';
import { findUser } from '../utils/';

/**
 * Authenticate the user.
 *
 * @param  {Object} ctx
 * @param  {Function} next
 * @return {Function}
 */
export default (request) => {
  const { body, header } = request;
  const userType = header['user-type'];

  if (!userType) return Promise.reject('The \'user-type\' header is not defined.');

  const authBody = {
    token: '',
    user: {},
  };

  const handleToken = token => {
    authBody.token = token;
    return authBody;
  };

  const loginError = err => Promise.reject(err);

  const checkPassword = user => {
    authBody.user = user;
    return bcryptCompare(body.password, user.password);
  };

  const handleSuccess = () => authBody.user;

  const findBody = {
    type: userType,
    filter: {
      email: body.email,
      meta: {
        archived: false,
      },
    },
  };

  return findUser(findBody)
    .then(checkPassword)
    .then(handleSuccess)
    .then(createToken)
    .then(handleToken)
    .catch(loginError);
};
