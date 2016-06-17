import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Upload Function to upload, replace, and delete from cloudinary.
 *
 * @param {Object} image - Object containing img and publicId
 * @param {String} verb - Either upload or destroy for cloudinary uploader
 * @return {Function} - Cloudinary callback function
 */
export default (image, verb) => {
  const options = image.publicId
    ? { public_id: image.publicId, invalidate: true }
    : { invalidate: true };

  const img = verb === 'upload' ? image.img : image.publicId;
  // noop - null function to pass to cloudinary as 2nd param
  const noop = () => null;

  return cloudinary.uploader[verb](img, noop, options);
};
