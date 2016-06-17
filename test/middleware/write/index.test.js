import test from 'ava';
import { run } from '../../../src/middleware/write';
import { db } from '../../../src/services';
import { schemas } from '../../fixtures';

test.before('connect', async t => {
  await db(schemas, '107.170.131.151', 'webcom').start();
  t.truthy(db().conn, 'connection is present');
});

test('run', async t => {
  const assertPost = res => {
    t.deepEqual(res, {
      id: 600,
      name: 'Antenna',
      email: 'testman@test.com',
    }, 'Created user with correct data');
  };

  await run({
    params: {
      table: 'user',
    },
    request: {
      method: 'post',
      body: {
        id: 600,
        name: 'Antenna',
        email: 'testman@test.com',
      },
    },
    response: {
      body: {},
    },
  }, assertPost, db);

  const assertPatch = res => {
    t.deepEqual(res, {
      id: 600,
      name: 'Battery',
      email: 'testman@test.com',
    }, 'Updated user name');
  };

  await run({
    params: {
      table: 'user',
      id: 600,
    },
    request: {
      method: 'patch',
      body: {
        name: 'Battery',
      },
    },
    response: {
      body: {},
    },
  }, assertPatch, db);

  const assertDelete = res => {
    t.is(res, true, 'User was deleted');
  };

  await run({
    params: {
      table: 'user',
      id: 600,
    },
    request: {
      method: 'delete',
      body: {
        id: 600,
      },
    },
    response: {
      body: {},
    },
  }, assertDelete, db);

  const assertInvalidMethod = res => t.falsy(res, 'Should have proper method');

  await run({
    params: {
      table: 'user',
      id: 600,
    },
    request: {
      method: 'invalid',
      body: {
        name: 'Battery',
      },
    },
  }, assertInvalidMethod, db);
});

test.after('teardown', async () => {
  await db().disconnect();
});
