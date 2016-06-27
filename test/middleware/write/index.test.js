import test from 'ava';
import { run } from '../../../src/middleware/write';
import { db } from '../../../src/services';
import { schemas } from '../../fixtures';

test.before('Write: Connect to database', async t => {
  await db(schemas, process.env.RETHINKDB_URL, process.env.RETHINKDB_NAME).start();
  t.truthy(db().instance().conn, 'connection is present');

  const table = await db().instance().clearTable('user');

  t.is(table, true, 'table (dummy) successfully cleared');
});

test('Write: Post, patch, and delete', async t => {
  const assertPost = res => {
    t.deepEqual(res.body, {
      id: '600',
      name: 'Antenna',
      email: 'testman@test.com',
      role: '1',
      password: 'hahaha',
    }, 'Created user with correct data');
  };

  await run({
    params: {
      table: 'user',
    },
    request: {
      method: 'POST',
      body: {
        id: '600',
        name: 'Antenna',
        email: 'testman@test.com',
        role: '1',
        password: 'hahaha',
      },
    },
    response: {
      body: {},
    },
  }, assertPost, db);

  const assertPatch = res => {
    t.deepEqual(res.body, {
      id: '600',
      name: 'Battery',
      email: 'testman@test.com',
      role: '1',
      password: 'hahaha',
    }, 'Updated user name');
  };

  await run({
    params: {
      table: 'user',
      id: '600',
    },
    request: {
      method: 'PATCH',
      body: {
        name: 'Battery',
      },
    },
    response: {
      body: {},
    },
  }, assertPatch, db);

  const assertDelete = res => t.is(res.body.deleted, true, 'User was deleted');

  await run({
    params: {
      table: 'user',
      id: '600',
    },
    request: {
      method: 'DELETE',
      body: {
        id: '600',
      },
    },
    response: {
      body: {},
    },
  }, assertDelete, db);

  const invalidToken = await run({
    params: {
      table: 'user',
      id: '600',
    },
    request: {
      method: 'invalid',
      body: {
        name: 'Battery',
      },
    },
    response: {
      status: '',
    },
  });

  t.is(invalidToken.status, 405, 'Method not allowed');

  const invalidBody = await run({
    params: {
      table: 'user',
    },
    request: {
      method: 'POST',
    },
    response: {
      status: '',
    },
  });

  t.is(invalidBody.status, 400, 'Body not defined');
});

test.after('Write: Teardown database', async () => {
  await db().stop();
});
