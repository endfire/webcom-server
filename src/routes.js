/* eslint-disable no-param-reassign */
export default {
  '/': {
    get(ctx) {
      ctx.body = 'Hello world!!!';
    },
  },

  '/auth/token': {
    post: {

    },
  },

  '/auth/verify': {
    post: {

    },
  },

  '/auth/renew': {
    post: {

    },
  },

  '/api/:table': {
    get: {

    },

    post: {

    },
  },

  '/api/:table/:id': {
    get: {

    },

    patch: {

    },

    del: {

    },
  },
};
