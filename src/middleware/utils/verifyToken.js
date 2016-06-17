import jwt from 'jsonwebtoken';
const secret = process.env.JWT_KEY;

/**
 * JWT Function to verify token.
 *
 * @param  {String}   ctx
 * @return {Function}
 */
export default ctx => {
  const { request: { header } } = ctx;
  const { authorization } = header;

  if (!authorization) return Promise.reject();

  return new Promise((resolve, reject) => {
    jwt.verify(authorization, secret, (err, decoded) => (
      err ? reject(err) : resolve(decoded))
    );
  });
};
