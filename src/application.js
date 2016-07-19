/* eslint-disable no-console */
import { configureRoutes } from './utils';
import bodyParser from 'koa-bodyparser';
import createError from 'http-errors';

export default (options, db) => {
  const { app, router, routes, schemas, host, name, port } = options;
  let server;

  return {
    start() {
      app.use(bodyParser());

      configureRoutes(router, routes);
      app.use(router.routes());

      return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
          console.log(`Server started on port ${port}.`);

          const redinkOptions = {
            schemas,
            host,
            name,
          };

          db.start(redinkOptions)
            .then(resolve)
            .catch(reject(createError(503, 'Cannot initialize the database.')));
        });
      });
    },

    stop() {
      db.stop().then(server.close);
    },
  };
};
