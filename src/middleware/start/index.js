/* eslint-disable no-param-reassign */

/**
 * Redink start middleware to set Koa response.
 *
 * @param {Obejct} ctx
 * @param {Function} next
 * @return {Object} - Koa response
 */
export default (ctx, next) => {
  const { response, request } = ctx;

  return next()
    .then(() => {
      if (Array.isArray(request.body)) {
        response.body = request.body.map(record => {
          delete record.password;
          return record;
        });
      } else if (typeof request.body === 'object') {
        delete request.body.password;
        response.body = request.body;
      } else {
        response.body = request.body;
      }
    })

    .catch(err => {
      response.status = err.status;
      response.body = {
        type: err.type,
        message: err.message,
      };
    });
};
