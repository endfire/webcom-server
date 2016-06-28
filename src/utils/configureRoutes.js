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
      const type = typeof middleware;

      // if the middleware is valid (i.e. it is a function), then mount it on the router
      if (type === 'function') {
        router[verb](path, middleware);
      } else if (type === 'object') {
        router[verb](path, middleware.middleware);
      } else {
        /* eslint-disable no-console */
        console.warn(
          `The route '${verb.toUpperCase()} ${path}' is registered but has invalid middleware ` +
          `of type '${typeof middleware}.'`
        );
      }
    }
  }
};
