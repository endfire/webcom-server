import { verifyToken } from '../../../utils/';

export default token => {
  if (!token) {
    return Promise.reject({
      message: 'Missing \'authorization\' header.',
    });
  }

  return verifyToken(token)
    .catch(err => (
      Promise.reject({
        message: err.message,
      })
    ));
};
