import { writeMiddleware, readMiddleware, authenticateMiddleware } from './middleware';

export default {
  '/auth/token': {
    post: authenticateMiddleware,
  },

  '/auth/verify': {
    post: authenticateMiddleware,
  },

  '/auth/renew': {
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
};
