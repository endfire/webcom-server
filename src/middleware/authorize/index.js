import { invalidMethodError, authorizationError } from '../utils/';

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
  getRelatedRule,
  patchRule,
  postRule,
} from './rules/';

export default (ctx, next) => {
  const { params: { id, field }, request: { method } } = ctx;
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
      if (field) dispatch = getRelatedRule(ctx);
      else if (id) dispatch = getOneRule(ctx);
      else dispatch = getAllRule(ctx);
      break;

    case POST:
      dispatch = postRule(ctx);
      break;

    case PATCH:
      dispatch = patchRule(ctx);
      break;

    case DELETE:
      dispatch = delRule(ctx);
      break;

    default:
      invalidMethodError(`Method '${method}' not authorized.`);
  }

  return dispatch
    .then(didRulePass)
    .then(next)
    .catch(handleAuthorizeError);
};
