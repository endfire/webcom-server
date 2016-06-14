import r from 'rethinkdb';
import test from 'ava';
import getFieldsToMerge from '../../../src/services/database/getFieldsToMerge';
import { schemas } from '../../fixtures';

let conn;

test.before('connect', async t => {
  try {
    conn = await r.connect({
      host: '107.170.131.151',
      db: 'test',
    });

    t.truthy(conn, 'successfully connected to RethinkDB');
  } catch (err) {
    t.fail(err.message);
  }
});

test('mergeRelationships with complete relationships', async t => {
  await r.table('users').insert({
    id: 1,
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
    company: 1,
    pets: [1, 2],
    cars: [
      {
        id: 1,
        type: 'Ferrari',
        color: 'red',
      },
    ],
  }).run(conn);

  await r.table('companies').insert({
    id: 1,
    name: 'Apple',
    employees: [1],
  }).run(conn);

  await r.table('animals').insert([{
    id: 1,
    species: 'dog',
    color: 'brown',
    owner: 1,
  }, {
    id: 2,
    species: 'cat',
    color: 'black',
    owner: 1,
  }]).run(conn);

  const merged = await r.table('users')
    .get(1)
    .merge(getFieldsToMerge(schemas, 'user'))
    .run(conn);

  const expected = {
    id: 1,
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
    company: {
      id: 1,
      name: 'Apple',
      employees: [1],
    },
    pets: [{
      id: 1,
      species: 'dog',
      owner: 1,
      color: 'brown',
    }, {
      id: 2,
      species: 'cat',
      owner: 1,
      color: 'black',
    }],
    cars: [
      {
        id: 1,
        type: 'Ferrari',
        color: 'red',
      },
    ],
  };

  t.deepEqual(merged, expected, 'merged object has correct json');
});

test('mergeRelationships with incomplete relationships', async t => {
  await r.table('users').insert({
    id: 2,
    name: 'Bobby',
    email: 'bobby@gmail.com',
    company: 2,
  }).run(conn);

  await r.table('companies').insert({
    id: 2,
    name: 'IBM',
    employees: [],
  }).run(conn);

  const merged = await r.table('users')
    .get(2)
    .merge(getFieldsToMerge(schemas, 'user'))
    .run(conn);

  const expected = {
    id: 2,
    name: 'Bobby',
    email: 'bobby@gmail.com',
    company: {
      id: 2,
      name: 'IBM',
      employees: [],
    },
  };

  t.deepEqual(merged, expected, 'merged object has correct json');
});

test.after(async () => {
  conn.close();
});
