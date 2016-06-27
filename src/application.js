/* eslint-disable no-console */
import { configureRoutes } from './utils';
import bodyParser from 'koa-bodyparser';
import { db } from './services';
import createError from 'http-errors';

export default (options) => {
  const { app, router, routes, schemas, host, name, port } = options;
  let server;
  console.log(name);

  return {
    start() {
      app.use(bodyParser());

      configureRoutes(router, routes);
      app.use(router.routes());

      return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
          console.log(`Server started on port ${port}.`);

          db(schemas, host, name)
            .start()
            .then(resolve)
            .catch(reject(createError(503, 'Cannot initialize the database.')));
        });
      });
    },

    stop() {
      db().stop().then(server.close);
    },
  };
};
