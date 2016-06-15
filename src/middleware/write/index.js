import db from '../../services';

export const run = (ctx, next, database) => {
  const { body, params, method } = ctx;
  const { table, id } = params;
  let dispatch;

  switch (method) {
    case 'post':
      dispatch = database.create(table, body);
      break;
    case 'patch':
      dispatch = database.update(table, id, body);
      break;
    case 'delete':
      dispatch = database.delete(table, id);
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
