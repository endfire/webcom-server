import compose from 'koa-compose';

/**
 * Mounts each path and verb as defined by the `routes` object onto the Koa `router` object.
 *
 * ```js
 * // example routes object
 * {
 *   '/users': {
 *     get: retrieveUsersMiddleware,
 *     post: createUsersMiddleware,
 *   },
 * }
 * ```
 *
 * @param {Object} router - Koa Router object.
 * @param {Object} routes - An object that defines the allowed routes and corresponding verbs.
 */
export default (router, routes) => {
  const { keys } = Object;
  const paths = keys(routes);

  for (const path of paths) {
    const verbs = keys(routes[path]);

    for (const verb of verbs) {
      const middleware = routes[path][verb];

      if (!Array.isArray(middleware)) {
        throw new Error('Tried configuring routes with middleware that wasn\'t an array.');
      }

      const composedMiddleware = compose(middleware);

      router[verb](path, composedMiddleware);
    }
  }
};
