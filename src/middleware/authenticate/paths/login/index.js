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
    return bcryptCompare(request.body.password, user.password);
  };

  const handleSuccess = () => {
    delete authBody.user.password;
    return authBody.user.id;
  };

  return findUser({ email: request.body.email })
    .then(checkPassword)
    .then(handleSuccess)
    .then(createToken)
    .then(handleToken)
    .catch(loginError);
};
