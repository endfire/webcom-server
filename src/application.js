/* eslint-disable no-console */
import createError from 'http-errors';

export default (options, db) => {
  const { server, schemas, host, name, port } = options;

  return {
    start() {
      return new Promise((resolve, reject) => {
        server.listen(port).then(message => {
          console.log(message);

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
      db.stop().then(server.stop());
    },
  };
};
