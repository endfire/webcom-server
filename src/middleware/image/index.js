/* eslint-disable no-param-reassign */
import cloudinary from 'cloudinary';
import schemas from '../../schemas';

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
  const { method, params, request: { body } } = ctx;
  const { table } = params;
  let dispatch;

  if (!!schemas[table].attributes.image) {
    switch (method) {
      case 'post':
        dispatch = cloudinary.uploader.upload(body.image, (result) => {
          body.image = result.secure_url;
          ctx.body = body;
        }, {
          public_id: `${table}-1`,
          invalidate: true,
        });
        break;
      case 'patch':
        break;
      case 'delete':
        break;
      default:
        return next();
    }
  }

  return dispatch.then(next);
};
