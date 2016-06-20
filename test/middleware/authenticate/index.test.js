import test from 'ava';
import { run } from '../../../src/middleware/authenticate';
import { db } from '../../../src/services';
import { schemas } from '../../fixtures';

let token;

test.before('connect', async t => {
  await db(schemas, process.env.RETHINKDB_URL, process.env.RETHINKDB_NAME).start();
  t.truthy(db().conn, 'connection is present');

  const table = await db().clearTable(process.env.AUTHENTICATE_TABLE);

  t.is(table, true, 'table (dummy) successfully cleared');
});

test('invalid method', async t => {
  const assertInvalidMethod = res => t.is(res, 403, 'Correct general status');

  await run({
    request: {
      method: 'invalid-method',
    },
    response: {
      status: '',
    },
  }, assertInvalidMethod, db);
});


test('authenticate process', async t => {
  const assertSignup = res => {
    t.not(res.body.token, '');
    token = res.body.token;
  };

  await run({
    request: {
      path: '/auth/signup',
      method: 'POST',
      body: {
        email: 'dummy@test.com',
        password: 'DummyPassword',
      },
    },
    response: {
      status: '',
      body: {
        token: '',
      },
    },
  }, assertSignup, db);

  const assertVerify = res => t.is(res, 202);

  await run({
    request: {
      path: '/auth/verify',
      method: 'POST',
      body: {
        token,
      },
    },
    response: {
      status: '',
      body: {
        token: '',
      },
    },
  }, assertVerify, db);

  const assertToken = res => t.not(res.body.token, '');

  await run({
    request: {
      path: '/auth/token',
      method: 'POST',
      body: {
        email: 'dummy@test.com',
        password: 'DummyPassword',
      },
    },
    response: {
      status: '',
      body: {
        token: '',
      },
    },
  }, assertToken, db);
});

test.after.always('teardown', async () => {
  await db().disconnect();
});
