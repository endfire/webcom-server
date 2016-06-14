import test from 'ava';
import Database from '../../../src/services/database';
import { schemas } from '../../fixtures';

const db = new Database(schemas, {
  host: '107.170.131.151',
  db: 'test',
});

test.before('connect', async t => {
  await db.connect();
  t.truthy(db.conn, 'connection is present');
});

test('create, read, update, delete', async t => {
  const user = await db.create('user', {
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  });

  t.deepEqual(user, {
    id: user.id,
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  });
});

test.after('teardown', async () => {
  await db.disconnect();
});
