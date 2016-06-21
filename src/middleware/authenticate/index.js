/* eslint-disable no-param-reassign */
import createToken from '../utils/createToken';
import verifyToken from '../utils/verifyToken';
import bcryptHash from '../utils/bcryptHash';
import bcryptCompare from '../utils/bcryptCompare';
import createUser from './createUser';
import findUser from './findUser';
import { db } from '../../services';

export const run = (ctx, next, database) => {
  const { request, response } = ctx;
  const { method, path } = request;
  let dispatch;

  // NOTE: May want to make this more specific to each error encountered
  const handleError = () => {
    response.status = 403;
    return response.status;
  };

  const handleHash = hashedPassword => {
    request.body.password = hashedPassword;
    return request.body;
  };

  const handleToken = token => {
    response.body.token = token;
    return response;
  };

  const handleUser = user => bcryptCompare(request.body.password, user.password)
    .then(res => (res ? user.id : Promise.reject()));

  const handleVerify = () => {
    response.status = 202;
    return response.status;
  };

  if (method !== 'POST') return handleError();

  const retrieveUserId = res => createUser(res, database);

  switch (path) {
    case '/auth/signup':
      dispatch = bcryptHash(request.body.password)
        .then(handleHash)
        .then(retrieveUserId)
        .then(createToken)
        .then(handleToken)
        .catch(handleError);
      break;
    case '/auth/verify':
      dispatch = verifyToken(request.body.token)
        .then(handleVerify)
        .catch(handleError);
      break;
    case '/auth/token':
      dispatch = findUser({ email: request.body.email }, database)
        .then(handleUser)
        .then(createToken)
        .then(handleToken)
        .catch(handleError);
      break;
    default:
      return handleError();
  }

  return dispatch.then(next);
};

/**
 * Authenticate the user.
 *
 * @param  {Object} ctx
 * @param  {Function} next
 * @return {Function}
 */
export default (ctx, next) => run(ctx, next, db);
