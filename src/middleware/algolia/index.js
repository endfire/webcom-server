import a from 'algoliasearch';
import { invalidRequestError, algoliaError } from '../utils/';
import { COMPANY, AD } from '../../constants/entities';

const client = a(process.env.ALGOLIA_ID, process.env.ALGOLIA_KEY);
const indexPrefix = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';

const validEntities = [
  COMPANY,
  AD,
];

/**
 * Syncs writes to Algolia using the response body's `id`.
 *
 * @throws {RedinkHttpError} - Catch and throw algolia error.
 *
 * @param {Object} ctx
 * @param {Function} next
 * @return {Function}
 */
export default (ctx, next) => {
  const { request, params: { table } } = ctx;
  const { body, method } = request;
  let dispatch;

  if (!validEntities.includes(table)) return next();

  const index = client.initIndex(`${indexPrefix}-${table}`);

  if (!body.id) {
    invalidRequestError(`The Algolia middleware expected 'body.id' but got '${body.id}'.`);
  }

  const hanldeAlgoliaError = err => algoliaError(err.message);

  switch (method) {
    case 'POST':
      dispatch = index
        .addObject({ ...body, objectID: body.id })
        .catch(hanldeAlgoliaError);
      break;
    case 'PATCH':
      dispatch = index
        .partialUpdateObject({ ...body, objectID: body.id })
        .catch(hanldeAlgoliaError);
      break;
    case 'DELETE':
      dispatch = index
        .deleteObject(`${body.id}`)
        .catch(hanldeAlgoliaError);
      break;
    default:
      return next();
  }

  return dispatch.then(next);
};
