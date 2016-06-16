import test from 'ava';
import { run } from '../../../src/middleware/read';
import Database from '../../../src/services/database';
import { schemas } from '../../fixtures';

const db = new Database(schemas, {
  host: '107.170.131.151',
  name: 'test',
});

test.before('connect', async t => {
  await db.connect();

  // FIXME: what the hell is db.conn in this assertion?
  t.truthy(db.conn, 'connection is present');
});

test('fetch a record, find records, use invalid method', async t => {
  const assertFetch = res => {
    t.deepEqual(res, {
      id: 123,
      name: 'Fresh',
      email: 'fresh@gmail.com',
    }, 'Fetched the correct user record');
  };

  await run({
    method: 'get',
    params: {
      table: 'user',
      id: 123,
    },
  }, assertFetch, db);
}); // test

// FIXME: Why not "test.after.always()"? Just in case of failing tests.
test.after('teardown', async () => {
  await db.disconnect();
});
