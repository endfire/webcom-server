/* eslint-disable no-param-reassign */
import cloudinary from 'cloudinary';
// import { schemas } from '../../schemas';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Image middleware that adds, updates, or deletes an image from cloudinary.
 *
 * @param {Object} ctx
 * @param {Object} next
 * @return {Function}
 */
export default (ctx, next) => {
  const { table } = ctx.params;
  const { body } = ctx.request;

  switch (ctx.method) {
    case 'POST':
      if (body.image) {
        cloudinary.uploader.upload(body.image.path, { public_id: `${table}-${body.name}` });
      }
      break;
    case 'PATCH':
      ctx.body = 'PATCH image middleware!';
      /* if (body.image) {
        cloudinary.uploader.upload(body.image.path, (result) => {
          body.image = result.secure_url;
        },
          {
            public_id: body.cloudinary,
            invalidate: true,
          },
        );
      }*/

      break;
    case 'DELETE':
      // Not sure exactly how to do this yet
      if (schemas[table].image) {
        cloudinary.uploader.destroy(body.cloudinary, (result) => {
        },
          {
            invalidate: true,
          }
        );
      }

      break;
    default:
      return next();
  }

  return next();
};
