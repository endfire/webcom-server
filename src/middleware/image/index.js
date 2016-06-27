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
  const { method } = request;
  let dispatch;

  if (!schemas[table].attributes || !schemas[table].attributes.image || !request.body.image) {
    return next();
  }

  const handleWrite = result => {
    request.body = {
      ...request.body,
      image: {
        img: result.secure_url,
        publicId: result.public_id,
      },
    };

    return request;
  };

  switch (method) {
    case 'POST':
      dispatch = upload(request.body.image, 'upload').then(handleWrite);
      break;
    case 'PATCH':
      dispatch = upload(request.body.image, 'upload').then(handleWrite);
      break;
    case 'DELETE':
      dispatch = upload(request.body.image, 'destroy').then(status => {
        response.body = status;
        return response;
      });
      break;
    default:
      return next();
  }

  return dispatch.then(next);
};
