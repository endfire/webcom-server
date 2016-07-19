/* eslint-disable no-param-reassign */
import { create, update, archive } from 'redink';
import { MethodNotAllowed, BadRequest } from 'http-errors';

export const run = (ctx, next) => {
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
      dispatch = create(table, request.body)
        .then(handleSuccess)
        .catch(handleError);
      break;
    case 'PATCH':
      dispatch = update(table, id, request.body)
        .then(handleSuccess)
        .catch(handleError);
      break;
    case 'DELETE':
      dispatch = archive(table, id)
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
export default (ctx, next) => run(ctx, next);
