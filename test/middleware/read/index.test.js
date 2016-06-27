import test from 'ava';
import r from 'rethinkdb';
import { run } from '../../../src/middleware/read';
import { db } from '../../../src/services';
import { schemas } from '../../fixtures';

test.before('Read: Connect to database', async t => {
  await db(schemas, process.env.RETHINKDB_URL, process.env.RETHINKDB_NAME).start();
  t.truthy(db().instance().conn, 'connection is present');

  const table = await db().instance().clearTable('person');

  t.is(table, true, 'person table successfully cleared');

  await db().instance().create('person', {
    id: '123',
    name: 'Fresh',
    email: 'fresh@gmail.com',
    phone: '1234',
    job: 'Janitor',
  });

  await db().instance().create('person', {
    id: '124',
    name: 'Doug',
    email: 'doug@gmail.com',
    phone: '1234',
    job: 'Janitor',
  });
});

test('Read: Find a record', async t => {
  const assertFind = res => {
    t.deepEqual(res.body, [
      {
        id: '123',
        name: 'Fresh',
        email: 'fresh@gmail.com',
        phone: '1234',
        job: 'Janitor',
      },
      {
        id: '124',
        name: 'Doug',
        email: 'doug@gmail.com',
        phone: '1234',
        job: 'Janitor',
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

test('Read: Fetch a record', async t => {
  const assertFetch = res => {
    t.deepEqual(res.body, {
      id: '123',
      name: 'Fresh',
      email: 'fresh@gmail.com',
      phone: '1234',
      job: 'Janitor',
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

test('Read: Invalid method', async t => {
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

test('Read: Invalid params', async t => {
  const assertInvalidMethod = res => t.falsy(res, 'Did not use proper method, GET');

  await run({
    request: {
      method: 'GET',
    },
    params: {},
    response: {
      body: {},
    },
  }, assertInvalidMethod, db);
});

test.after.always('Read: Teardown database', async () => {
  await db().stop();
});
