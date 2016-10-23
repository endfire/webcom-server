/* eslint-disable no-param-reassign */
import { create, update, archive } from 'redink';
import { invalidRequestError, invalidMethodError, bcryptHash } from '../utils/';

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

  const handleHash = hashedPassword => {
    request.body.password = hashedPassword;
    return create(table, request.body);
  };

  const handleUpdateHash = hashedPassword => {
    request.body.password = hashedPassword;
    return update(table, id, request.body);
  };

  const handleSuccess = result => {
    request.body = result;
    return request;
  };

  const handleWriteError = err => invalidRequestError(err.message);

  switch (method) {
    case 'POST':
      if (table === 'user' || table === 'company') {
        dispatch = bcryptHash(request.body.password)
          .then(handleHash)
          .then(handleSuccess)
          .catch(handleWriteError);
      } else {
        dispatch = create(table, request.body)
          .then(handleSuccess)
          .catch(handleWriteError);
      }
      break;
    case 'PATCH':
      if (request.body.password) {
        dispatch = bcryptHash(request.body.password)
          .then(handleUpdateHash)
          .then(handleSuccess)
          .catch(handleWriteError);
      } else {
        dispatch = update(table, id, request.body)
          .then(handleSuccess)
          .catch(handleWriteError);
      }
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
