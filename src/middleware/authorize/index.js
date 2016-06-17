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
  const { response } = ctx;

  const handleSuccess = () => {
    response.status = 202;
    return response.status;
  };

  const handleError = () => {
    response.status = 403;
    return response.status;
  };

  return verify(ctx)
    .then(handleSuccess)
    .then(next)
    .catch(handleError);
};
