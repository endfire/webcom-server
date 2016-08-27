// import { forEach } from 'lodash';
// import { schemas } from '@directly/schemas';

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
        response.body = request.body;
        break;
      case 'array':
        response.body = request.body;
        break;
      default:
        response.body = request.body;
    }

    return response;
  })
);
