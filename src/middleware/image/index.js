/* eslint-disable no-param-reassign */
import schemas from '../../schemas';
import upload from './uploadCloudinary';

/**
 * Image middleware that adds, updates, or deletes an image from cloudinary.
 *
 * @param {Object} ctx
 * @param {Object} next
 * @return {Function}
 */
export default (ctx, next) => {
  const { params: { table }, request, response } = ctx;
  const { body, method } = request;
  let dispatch;

  if (!schemas[table].attributes.image || !body.image) return next();

  const handleWrite = result => {
    response.body = {
      ...body,
      image: {
        img: result.secure_url,
        publicId: result.public_id,
      },
    };

    return response.body;
  };

  switch (method) {
    case 'post':
      dispatch = upload(body.image, 'upload').then(handleWrite);
      break;
    case 'patch':
      dispatch = upload(body.image, 'upload').then(handleWrite);
      break;
    case 'delete':
      dispatch = upload(body.image, 'destroy').then(status => (response.body = status.result));
      break;
    default:
      return next();
  }

  return dispatch.then(next);
};
