import Database from './database';

function database(schemas, host, name) {
  let db;

  const createInstance = () => new Database(schemas, { host, name });

  return {
    start() {
      if (db === undefined) {
        db = createInstance();
        return db.connect();
      }

      return db();
    },
  };
}

export { database as db };
