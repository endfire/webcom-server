/**
 * Writes data to the database based on data and id.
 *
 * @param {Object} ctx
 * @param {Function} next
 * @param {Object} db - Connected database object passed down.
 * @return {Function}
 */
export default (ctx, next, db) => {
  const { body, params, method } = ctx;
  const { table, id } = params;
  let dispatch;

  switch (method) {
    case 'post':
      dispatch = db.create(table, body);
      break;
    case 'patch':
      dispatch = db.update(table, id, body);
      break;
    case 'delete':
      dispatch = db.delete(table, id);
      break;
    default:
      return next();
  }

  return dispatch.then(next);
};
