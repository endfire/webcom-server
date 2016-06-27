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
  const { request, response } = ctx;
  const { body, method } = request;
  let dispatch;

  const handleError = () => {
    response.status = 424;
    return response;
  };

  if (!body.id) return handleError();

  switch (method) {
    case 'POST':
      dispatch = index
        .addObject({ ...body, objectID: body.id })
        .catch(handleError);
      break;
    case 'PATCH':
      dispatch = index
        .partialUpdateObject({ ...body, objectID: body.id })
        .catch(handleError);
      break;
    case 'DELETE':
      dispatch = index
        .deleteObject(`${body.id}`)
        .catch(handleError);
      break;
    default:
      return next();
  }

  return dispatch.then(next);
};
