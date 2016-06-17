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
  const handleSuccess = () => {
    ctx.status = 202;
    return ctx.status;
  };

  const handleError = () => {
    ctx.status = 403;
    return ctx.status;
  };

  return verify(ctx)
    .then(handleSuccess)
    .then(next)
    .catch(handleError);
};
