/* eslint-disable no-param-reassign */
import verify from '../utils/verifyToken';

/**
 * Authorize middleware to verify API calls.
 * TODO: Replace status codes with status middleware.
 *
 * @param {Object} ctx
 * @param {Function} next
 * @return {Function}
 */
export default (ctx, next) => {
  const { response, request: { header } } = ctx;
  const { authorization } = header;

  const handleSuccess = () => {
    response.status = 202;
    return response;
  };

  return verify(authorization)
    .then(handleSuccess)
    .then(next)
    .catch(err => {
      response.status = err.status;
      return response;
    });
};
