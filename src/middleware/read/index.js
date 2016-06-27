/* eslint-disable no-param-reassign */
import { db } from '../../services';
import { BadRequest } from 'http-errors';

export const run = (ctx, next, database) => {
  const { params, request: { method }, request, response } = ctx;
  const { table, id, filter } = params;

  if (method !== 'GET') return next();

  const handleResponse = results => {
    request.body = results;
    return request;
  };

  const handleError = err => {
    response.status = err.status;
    return response;
  };

  if (!id && !filter) return handleError(new BadRequest());

  const dispatch = id
    ? database().instance()
      .fetch(table, id)
      .then(handleResponse)
      .catch(handleError)
    : database().instance()
      .find(table, filter)
      .then(handleResponse)
      .catch(handleError);

  return dispatch.then(next);
};

/**
 * Middleware to read from the database based on the request params.
 *
 * @param {Object} ctx
 * @param {Function} next
 * @return {Function}
 */
export default (ctx, next) => run(ctx, next, db);
