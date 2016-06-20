import test from 'ava';
import r from 'rethinkdb';
import { run } from '../../../src/middleware/read';
import { db } from '../../../src/services';
import { schemas } from '../../fixtures';

test.before('connect', async t => {
  await db(schemas, process.env.RETHINKDB_URL, process.env.RETHINKDB_NAME).start();
  t.truthy(db().conn, 'connection is present');

  const table = await db().clearTable('person');

  t.is(table, true, 'person table successfully cleared');

  await db().create('person', {
    id: '123',
    name: 'Fresh',
    email: 'fresh@gmail.com',
  });

  await db().create('person', {
    id: '124',
    name: 'Doug',
    email: 'doug@gmail.com',
  });
});

test('find a record', async t => {
  const assertFind = res => {
    t.deepEqual(res, [
      {
        id: '123',
        name: 'Fresh',
        email: 'fresh@gmail.com',
      },
      {
        id: '124',
        name: 'Doug',
        email: 'doug@gmail.com',
      },
    ], 'Found the correct person record');
  };

  await run({
    request: {
      method: 'GET',
    },
    params: {
      table: 'person',
      filter: r.row('name').eq('Doug').or(r.row('name').eq('Fresh')),
    },
    response: {
      body: {},
    },
  }, assertFind, db);
});

test('fetch a record', async t => {
  const assertFetch = res => {
    t.deepEqual(res, {
      id: '123',
      name: 'Fresh',
      email: 'fresh@gmail.com',
    }, 'Fetched the correct person record');
  };

  await run({
    request: {
      method: 'GET',
    },
    params: {
      table: 'person',
      id: '123',
    },
    response: {
      body: {},
    },
  }, assertFetch, db);
});

test('invalid method', async t => {
  const assertInvalidMethod = res => t.falsy(res, 'Did not use proper method, GET');

  await run({
    request: {
      method: 'invalid-method',
    },
    params: {},
    response: {
      body: {},
    },
  }, assertInvalidMethod, db);
});

test.after.always('teardown', async () => {
  await db().disconnect();
});
