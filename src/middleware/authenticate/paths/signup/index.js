/* eslint-disable no-param-reassign */
import {
  createToken,
  bcryptHash,
} from '../../../utils/';

import { createUser } from '../utils/';

/**
 * Signup
 *
 * @param  {Object} ctx
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

  const handleHash = hashedPassword => {
    body.password = hashedPassword;
    return {
      type: userType,
      body,
    };
  };

  const handleSignupUser = user => {
    authBody.user = user;
    return createToken(user);
  };

  const signupError = err => Promise.reject(err);

  return bcryptHash(body.password)
    .then(handleHash)
    .then(createUser)
    .then(handleSignupUser)
    .then(handleToken)
    .catch(signupError);
};
