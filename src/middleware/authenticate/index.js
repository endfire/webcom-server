/* eslint-disable no-param-reassign */
import createToken from '../utils/createToken';
import verifyToken from '../utils/verifyToken';
import bcryptHash from '../utils/bcryptHash';
import bcryptCompare from '../utils/bcryptCompare';
import createUser from './createUser';
import findUser from './findUser';
import { db } from '../../services';
import { Unauthorized, MethodNotAllowed, BadRequest, NotAcceptable } from 'http-errors';

export const run = (ctx, next, database) => {
  const { request, response } = ctx;
  const { method, path } = request;
  let dispatch;

  const handleToken = token => {
    response.body.token = token;
    return response;
  };

  const handleVerify = () => {
    response.status = 202;
    return response.status;
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

  if (method !== 'POST') return new MethodNotAllowed();

  const retrieveUserId = res => createUser(res, database);

  switch (path) {
    case '/auth/signup':
      dispatch = bcryptHash(request.body.password)
        .then(handleHash)
        .then(retrieveUserId)
        .then(createToken)
        .then(handleToken)
        .catch(err => err);
      break;
    case '/auth/verify':
      dispatch = verifyToken(request.body.token)
        .then(handleVerify)
        .catch(Unauthorized);
      break;
    case '/auth/token':
      dispatch = findUser({ email: request.body.email }, database)
        .then(handleUser)
        .then(createToken)
        .then(handleToken)
        .catch(err => err);
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
