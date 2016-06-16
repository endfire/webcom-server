/* eslint-disable no-param-reassign */
import { db } from '../../services';

export const run = (ctx, next, database) => {
  const { params, method, request: { body } } = ctx;
  const { table, id } = params;
  let dispatch;

  switch (method) {
    case 'post':
      dispatch = database().create(table, body).then(record => (ctx.body = record));
      break;
    case 'patch':
      dispatch = database().update(table, id, body).then(record => (ctx.body = record));
      break;
    case 'delete':
      dispatch = database().delete(table, id).then(status => (ctx.body = status));
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
