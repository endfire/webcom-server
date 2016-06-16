import Database from './database';

function db(schemas, host, name) {
  if (db.instance) return db.instance;

  const createInstance = () => new Database(schemas, { host, name });

  return {
    start() {
      db.instance = createInstance();
      return db.instance.connect();
    },
  };
}

export { db };
