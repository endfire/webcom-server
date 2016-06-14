import r from 'rethinkdb';
import normalizeTableName from './normalizeTableName';

export default class Database {
  constructor(schemas = {}, { db = '', host = '' }) {
    this.schemas = schemas;
    this.db = db;
    this.host = host;
  }

  connect() {
    const { host, db } = this;

    return new Promise((resolve, reject) => {
      r.connect({ host, db }).then(conn => {
        this.conn = conn;
        return resolve(conn);
      }).catch(reject);
    });
  }

  disconnect() {
    return this.conn.close();
  }

  create(type, data) {
    const { conn, schemas } = this;
    const table = r.table(normalizeTableName(schemas, type));

    const fetch = ({ generated_keys: keys }) =>
      table.get(keys[0]).run(conn);

    return new Promise((resolve, reject) => {
      table
        .insert(data)
        .run(conn)
        .then(fetch)
        .then(resolve)
        .catch(reject);
    });
  }

  update(type, id, data) {
    const { conn, schemas } = this;
    const table = r.table(normalizeTableName(schemas, type));

    const fetch = () => table.get(id).run(conn);

    return new Promise((resolve, reject) => {
      table
        .get(id)
        .update(data, { returnChanges: true })
        .run(conn)
        .then(fetch)
        .then(resolve)
        .catch(reject);
    });
  }

  delete(type, id) {
    const { conn, schemas } = this;
    const table = r.table(normalizeTableName(schemas, type));

    const didSucceed = ({ deleted }) => deleted === 1;

    return new Promise((resolve, reject) => {
      table
        .get(id)
        .delete()
        .run(conn)
        .then(didSucceed)
        .then(resolve)
        .catch(reject);
    });
  }

  find(type, filter) {
    const { conn, schemas } = this;
    const table = r.table(normalizeTableName(schemas, type));

    return new Promise((resolve, reject) => {
      table
        .filter(filter)
        .run(conn)
        .then(resolve)
        .catch(reject);
    });
  }

  fetch(type, id) {
    const { conn, schemas } = this;
    const table = r.table(normalizeTableName(schemas, type));

    return new Promise((resolve, reject) => {
      table
        .get(id)
        .run(conn)
        .then(resolve)
        .catch(reject);
    });
  }

  /*
  fetchRelated(type, id, field) {
    const { conn, schemas } = this;
    const table = r.table(type);
    const related = r.table(schemas[type][field])
    const fetch = ({ field }) => {
      if (field.is(null) || field === undefined)
        return undefined;
      if (typeof field === 'object')
        return field;
      return Array.isArray(field)
        ? table.getAll
    }
    return new Promise((resolve, reject) => {
      table
        .get(id)
        .run(conn)
        .then(fetch)
        .then(resolve)
        .catch(reject);
    });
  }
  */
}
