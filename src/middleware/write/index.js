/* eslint-disable no-param-reassign */
import { db } from '../../services';
import { MethodNotAllowed, BadRequest } from 'http-errors';

export const run = (ctx, next, database) => {
  const { params, request, response } = ctx;
  const { table, id } = params;
  const { method } = request;
  let dispatch;

  const handleSuccess = result => {
    request.body = result;
    return request;
  };

  const handleError = err => {
    response.status = err.status;
    return response;
  };

  if (!request.body) return handleError(new BadRequest());

  switch (method) {
    case 'POST':
      dispatch = database().instance()
        .create(table, request.body)
        .then(handleSuccess)
        .catch(handleError);
      break;
    case 'PATCH':
      dispatch = database().instance()
        .update(table, id, request.body)
        .then(handleSuccess)
        .catch(handleError);
      break;
    case 'DELETE':
      dispatch = database().instance()
        .delete(table, id)
        .then(handleSuccess)
        .catch(handleError);
      break;
    default:
      return handleError(new MethodNotAllowed());
  }

  return dispatch.then(next);
};

/**
 * Writes data to the database based on data and id.
 *
 * @param {Object} ctx
 * @param {Function} next
 * @return {Function}
 */
export default (ctx, next) => run(ctx, next, db);
