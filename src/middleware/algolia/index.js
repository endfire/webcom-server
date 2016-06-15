import a from 'algoliasearch';

const client = a(process.env.ALGOLIA_ID, process.env.ALGOLIA_KEY);
const index = client.initIndex('webcom');

/**
 * Syncs writes to Algolia using the response body's `id`.
 *
 * @param {Object} ctx
 * @param {Function} next
 * @return {Function}
 */
export default (ctx, next) => {
  const { body, method } = ctx;
  let dispatch;

  switch (method) {
    case 'post':
      dispatch = index.addObject({ ...body, objectID: body.id });
      break;
    case 'patch':
      dispatch = index.partialUpdateObject({ ...body, objectID: body.id });
      break;
    case 'delete':
      dispatch = index.deleteObject(body.id);
      break;
    default:
      return next();
  }

  return dispatch.then(next);
};
