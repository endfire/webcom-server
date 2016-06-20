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
    return response.status;
  };

  const handleError = () => {
    response.status = 403;
    return response.status;
  };

  return verify(authorization)
    .then(handleSuccess)
    .then(next)
    .catch(handleError);
};
