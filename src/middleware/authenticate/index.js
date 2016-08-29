/* eslint-disable no-param-reassign */
import {
  invalidRequestError,
  invalidMethodError,
  authenticationError,
} from '../utils/';

import {
  signup,
  verify,
  login,
} from './paths/';

/**
 * Authenticate the user.
 *
 * @param  {Object} ctx
 * @param  {Function} next
 * @return {Function}
 */
export default (ctx, next) => {
  const { request } = ctx;
  const { method, path } = request;
  let dispatch;

  if (method !== 'POST') {
    invalidMethodError(`Method not allowed, expected POST but got ${method}`);
  }

  const handleRequest = body => {
    request.body = body;
    return request;
  };

  const handleAuthenticateError = () => authenticationError('Incorrect email and/or password.');

  switch (path) {
    case '/auth/signup':
      dispatch = signup(request)
        .then(handleRequest)
        .catch(handleAuthenticateError);
      break;
    case '/auth/verify':
      dispatch = verify(request)
        .then(handleRequest)
        .catch(handleAuthenticateError);
      break;
    case '/auth/token':
      dispatch = login(request)
        .then(handleRequest)
        .catch(handleAuthenticateError);
      break;
    default:
      invalidRequestError(`Expected valid path, but got ${path}`);
  }

  return dispatch.then(next);
};
