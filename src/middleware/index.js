/* eslint-disable no-param-reassign */
import compose from 'koa-compose';

function test(ctx, next) {
  ctx.body = 'Middleware worked!';
  return next();
}

export default compose([test]);
