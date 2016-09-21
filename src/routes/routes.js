import {
  authenticateMiddleware,
  readMiddleware,
  writeMiddleware,
  downloadMiddleware,
} from '../middleware';

export default {
  '/auth/token': {
    post: authenticateMiddleware,
  },

  '/auth/verify': {
    post: authenticateMiddleware,
  },

  '/auth/signup': {
    post: authenticateMiddleware,
  },

  '/api/:table': {
    get: readMiddleware,
    post: writeMiddleware,
  },

  '/api/:table/:id': {
    get: readMiddleware,
    patch: writeMiddleware,
    del: writeMiddleware,
  },

  '/api/:table/:id/:field': {
    get: readMiddleware,
  },

  '/download/:downloadTable': {
    post: downloadMiddleware,
  },

  '/download/:downloadTable/:id': {
    post: downloadMiddleware,
  },
};
