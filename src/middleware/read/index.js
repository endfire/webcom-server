/* eslint-disable no-param-reassign */
import { db } from '../../services';

export const run = (ctx, next, database) => {
  const { params, request: { method } } = ctx;
  const { table, id, filter } = params;

  if (method !== 'get') return next();

  const handleResponse = results => {
    ctx.response.body = results;
    return (results);
  };

  const dispatch = id
    ? database().fetch(table, id).then(handleResponse)
    : database().find(table, filter).then(handleResponse);

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
