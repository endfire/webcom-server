/**
 * Return middleware to stringify response body.
 *
 * @param {Object} ctx
 * @return {Object} response - Koa response.
 */
export default (ctx) => {
  const { response, request } = ctx;

  response.body = (typeof request.body === 'object')
    ? response.body = request.body
    : { status: 200 };

  return response;
};
