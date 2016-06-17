/* eslint-disable no-param-reassign */
import { db } from '../../services';

export const run = (ctx, next, database) => {
  const { params, request, response } = ctx;
  const { table, id } = params;
  const { body, method } = request;
  let dispatch;

  switch (method) {
    case 'POST':
      dispatch = database().create(table, body).then(record => (response.body = record));
      break;
    case 'PATCH':
      dispatch = database().update(table, id, body).then(record => (response.body = record));
      break;
    case 'DELETE':
      dispatch = database().delete(table, id).then(status => (response.body = status));
      break;
    default:
      return next();
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
