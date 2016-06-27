/* eslint-disable no-param-reassign */
import createToken from '../utils/createToken';
import verifyToken from '../utils/verifyToken';
import bcryptHash from '../utils/bcryptHash';
import bcryptCompare from '../utils/bcryptCompare';
import createUser from './createUser';
import findUser from './findUser';
import { db } from '../../services';
import { MethodNotAllowed, BadRequest, NotAcceptable } from 'http-errors';

export const run = (ctx, next, database) => {
  const { request, response } = ctx;
  const { method, path } = request;
  let dispatch;

  if (method !== 'POST') return new MethodNotAllowed();

  const handleToken = token => {
    response.body = { token };
    return response;
  };

  const handleVerify = () => {
    response.status = 202;
    return response;
  };

  const handleHash = hashedPassword => {
    request.body.password = hashedPassword;
    return request.body;
  };

  const handleUser = user => bcryptCompare(request.body.password, user.password)
    .then(res => {
      if (res) return user.id;
      throw new NotAcceptable();
    });

  const retrieveUserId = res => createUser(res, database);

  // This is a temporary handler pending `bluebird` filter .catch implementation
  const handleError = err => {
    response.status = err.status;
    return response;
  };

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
      return new BadRequest();
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
