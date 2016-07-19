import test from 'ava';
import r from 'rethinkdb';
import { run } from '../../../src/middleware/read';
import redink, { create } from 'redink';
import { schemas } from '../../fixtures';

test.before('Read: Connect to database', async t => {
  const options = {
    host: process.env.RETHINKDB_URL,
    name: process.env.RETHINKDB_NAME,
    schemas,
  };

  const conn = await redink().start(options);

  t.truthy(conn, 'connection is present');

  const table = await r.table('person').delete().run(conn);

  t.truthy(table, 'table (dummy) successfully cleared');

  await create('person', {
    id: '123',
    name: 'Fresh',
    email: 'fresh@gmail.com',
    phone: '1234',
    job: 'Janitor',
  });

  await create('person', {
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
        meta: {
          archived: false,
        },
      },
      {
        id: '124',
        name: 'Doug',
        email: 'doug@gmail.com',
        phone: '1234',
        job: 'Janitor',
        meta: {
          archived: false,
        },
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
  }, assertFind);
});

test('Read: Fetch a record', async t => {
  const assertFetch = res => {
    t.deepEqual(res.body, {
      id: '123',
      name: 'Fresh',
      email: 'fresh@gmail.com',
      phone: '1234',
      job: 'Janitor',
      meta: {
        archived: false,
      },
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
  }, assertFetch);
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
  }, assertInvalidMethod);
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
  }, assertInvalidMethod);
});

test.after.always('Read: Teardown database', async () => {
  await redink().stop();
});
