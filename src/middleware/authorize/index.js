import { invalidRequestError, authorizationError, verifyToken } from '../utils/';

/**
 * Authorize middleware to verify API calls.
 *
 * @param {Object} ctx
 * @param {Function} next
 * @return {Function}
 */
export default (ctx, next) => {
  const { request: { header } } = ctx;
  const { authorization } = header;

  if (!authorization) {
    invalidRequestError('Missing authorization header.');
  }

  const handleAuthorizeError = err => authorizationError(err.message);

  return verifyToken(authorization)
    .then(next)
    .catch(handleAuthorizeError);
};

/* import { invalidMethodError, authorizationError } from '../utils/';

import {
  GET,
  POST,
  PATCH,
  DELETE,
} from '../../constants/http';

import {
  delRule,
  getAllRule,
  getOneRule,
  patchRule,
  postRule,
} from './rules/';

export default (ctx, next) => {
  const { params: { id }, request: { method } } = ctx;
  let dispatch;

  const handleAuthorizeError = err => authorizationError(err.message);

  const didRulePass = passed => {
    if (!passed) {
      return Promise.reject({
        message: 'You are not authorized to make this api call.',
      });
    }
    return passed;
  };

  switch (method) {
    case GET:
      dispatch = id
        ? getOneRule(ctx)
            .then(didRulePass)
            .catch(handleAuthorizeError)
        : getAllRule(ctx)
            .then(didRulePass)
            .catch(handleAuthorizeError);
      break;
    case POST:
      dispatch = postRule(ctx)
        .then(didRulePass)
        .catch(handleAuthorizeError);
      break;
    case PATCH:
      dispatch = patchRule(ctx)
        .then(didRulePass)
        .catch(handleAuthorizeError);
      break;
    case DELETE:
      dispatch = delRule(ctx)
        .then(didRulePass)
        .catch(handleAuthorizeError);
      break;
    default:
      invalidMethodError(`Method '${method}' not authorized.`);
  }

  return dispatch.then(next);
}; */
