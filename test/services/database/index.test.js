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
  let user;

  user = await db.create('user', {
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  });

  t.deepEqual(user, {
    id: user.id,
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  }, 'created user has correct json');

  user = await db.fetch('user', user.id);

  t.deepEqual(user, {
    id: user.id,
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  }, 'fetched user has correct json');

  user = await db.update('user', user.id, {
    name: 'Dy-lon',
  });

  t.deepEqual(user, {
    id: user.id,
    name: 'Dy-lon',
    email: 'dylanslack@gmail.com',
  }, 'updated user has correct json');

  user = await db.delete('user', user.id);

  t.is(user, true, 'user was successfully deleted');
});

test.after('teardown', async () => {
  await db.disconnect();
});
