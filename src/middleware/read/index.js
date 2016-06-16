/* eslint-disable no-param-reassign */
import { db } from '../../services';

export const run = (ctx, next, database) => {
  const { table, id } = ctx.params;
  const { method } = ctx.request;

  if (method !== 'get') return next();

  const handleResponse = results => {
    ctx.status = results ? 200 : 204;

    // TODO: Possibly JSON.stringify results (object(s))
    ctx.body = results;
  };

  const dispatch = id
    ? database().fetch(table, id).then(handleResponse)
    : database().find(table).then(handleResponse);

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
