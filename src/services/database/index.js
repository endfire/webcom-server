import r from 'rethinkdb';
import normalizeTableName from './normalizeTableName';
import sanitizeRequest from './sanitizeRequest';
import getFieldsToMerge from './getFieldsToMerge';

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

    const sanitizedData = sanitizeRequest(schemas[type], data);
    const fieldsToMerge = getFieldsToMerge(schemas, type);
    const fetch = ({ generated_keys: keys }) =>
      table
        .get((keys && keys[0]) || data.id)
        .merge(fieldsToMerge)
        .run(conn);

    return new Promise((resolve, reject) => {
      table
        .insert(sanitizedData)
        .run(conn)
        .then(fetch)
        .then(resolve)
        .catch(reject);
    });
  }

  update(type, id, data) {
    const { conn, schemas } = this;
    const table = r.table(normalizeTableName(schemas, type));

    const sanitizedData = sanitizeRequest(schemas[type], data);
    const fieldsToMerge = getFieldsToMerge(schemas, type);
    const fetch = () => table.get(id).merge(fieldsToMerge).run(conn);

    return new Promise((resolve, reject) => {
      table
        .get(id)
        .update(sanitizedData, { returnChanges: true })
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
    const fieldsToMerge = getFieldsToMerge(schemas, type);

    return new Promise((resolve, reject) => {
      table
        .filter(filter)
        .merge(fieldsToMerge)
        .run(conn)
        .then(resolve)
        .catch(reject);
    });
  }

  fetch(type, id) {
    const { conn, schemas } = this;
    const table = r.table(normalizeTableName(schemas, type));
    const fieldsToMerge = getFieldsToMerge(schemas, type);

    return new Promise((resolve, reject) => {
      table
        .get(id)
        .merge(fieldsToMerge)
        .run(conn)
        .then(resolve)
        .catch(reject);
    });
  }

  /*
  fetchRelated('user', 1, 'pets')

  r.table('animals').getAll(r.args(
    r.table('users').get(1)('pets')
  )).merge(function(animal) {
    return {
      owner: r.table('users').get(animal('owner'))
    }
  })

   */
  fetchRelated(type, id, field) {
    const { conn, schemas } = this;

    const relationship = schemas[type].relationships[field];
    const { hasMany, belongsTo } = relationship;
    const parentTable = r.table(normalizeTableName(schemas, type));
    const relatedType = hasMany || belongsTo;
    const relatedTable = hasMany
      ? r.table(normalizeTableName(schemas, hasMany))
      : r.table(normalizeTableName(schemas, belongsTo));

    const fetch = hasMany
      ? relatedTable.getAll(r.args(parentTable.get(id)(field))).coerceTo('array')
      : relatedTable.get(parentTable.get(id)(field));

    return new Promise((resolve, reject) => {
      fetch
        .merge(getFieldsToMerge(schemas, relatedType))
        .run(conn)
        .then(resolve)
        .catch(reject);
    });
  }
}
