/* eslint-disable no-param-reassign */

/**
 * Redink start middleware to set Koa response.
 *
 * @param {Obejct} ctx
 * @param {Function} next
 * @return {Object} - Koa response
 */
export default (ctx, next) => (
  next().then(() => {
    const { response, request } = ctx;

    switch (typeof request.body) {
      case 'object':
        delete request.body.password;
        response.body = request.body;
        break;

      case 'array':
        response.body = request.body.map(record => {
          delete record.password;
          return record;
        });
        break;

      default:
        response.body = request.body;
    }

    return response;
  })
);
