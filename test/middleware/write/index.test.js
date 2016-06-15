import test from 'ava';
import { run } from '../../../src/middleware/write';
import Database from '../../../src/services/database';
import { schemas } from '../../fixtures';

const db = new Database(schemas, {
  host: '107.170.131.151',
  name: 'test',
});

test.before('connect', async t => {
  await db.connect();
  t.truthy(db.conn, 'connection is present');
});

test('run', async t => {
  const assertPost = res => {
    t.deepEqual(res, {
      id: 500,
      name: 'Antenna',
      email: 'testman@test.com',
    }, 'Created user with correct data');
  };

  await run({
    method: 'post',
    params: {
      table: 'user',
    },
    body: {
      id: 500,
      name: 'Antenna',
      email: 'testman@test.com',
    },
  }, assertPost, db);

  const assertPatch = res => {
    t.deepEqual(res, {
      id: 500,
      name: 'Battery',
      email: 'testman@test.com',
    }, 'Updated user name');
  };

  await run({
    method: 'patch',
    params: {
      table: 'user',
      id: 500,
    },
    body: {
      name: 'Battery',
    },
  }, assertPatch, db);

  const assertDelete = res => {
    t.is(res, true, 'User was deleted');
  };

  await run({
    method: 'delete',
    params: {
      table: 'user',
      id: 500,
    },
  }, assertDelete, db);

  const assertInvalidMethod = res => t.falsy(res, 'Should have proper method');

  await run({
    method: 'invalid',
    params: {
      table: 'user',
      id: 500,
    },
    body: {
      name: 'Battery',
    },
  }, assertInvalidMethod, db);
});

test.after('teardown', async () => {
  await db.disconnect();
});
