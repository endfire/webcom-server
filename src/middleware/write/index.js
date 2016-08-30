/* eslint-disable no-param-reassign */
import { create, update, archive } from 'redink';
import { invalidRequestError, invalidMethodError } from '../utils/';

/**
 * Writes data to the database based on data and id.
 *
 * @param {Object} ctx
 * @param {Function} next
 * @return {Function}
 */
export default (ctx, next) => {
  const { params, request } = ctx;
  const { table, id } = params;
  const { method } = request;
  let dispatch;

  const handleSuccess = result => {
    request.body = result;
    return request;
  };

  const handleWriteError = err => invalidRequestError(err.message);

  switch (method) {
    case 'POST':
      dispatch = create(table, request.body)
        .then(handleSuccess)
        .catch(handleWriteError);
      break;
    case 'PATCH':
      dispatch = update(table, id, request.body)
        .then(handleSuccess)
        .catch(handleWriteError);
      break;
    case 'DELETE':
      dispatch = archive(table, id)
        .then(handleSuccess)
        .catch(handleWriteError);
      break;
    default:
      invalidMethodError(`Invalid method expecting GET but got '${method}'`);
  }

  return dispatch.then(next);
};
