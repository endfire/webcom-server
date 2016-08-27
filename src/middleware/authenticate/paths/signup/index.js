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
  const authBody = {
    token: '',
    user: {},
  };

  const handleToken = token => {
    authBody.token = token;
    return authBody;
  };

  const handleHash = hashedPassword => {
    request.body.password = hashedPassword;
    return request.body;
  };

  const handleSignupUser = user => {
    delete user.password;
    delete user.stripe;
    authBody.user = user;
    return createToken(user);
  };

  const signupError = err => Promise.reject(err);

  return bcryptHash(request.body.password)
    .then(handleHash)
    .then(createUser)
    .then(handleSignupUser)
    .then(handleToken)
    .catch(signupError);
};
