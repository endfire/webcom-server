import test from 'ava';
import { run } from '../../../src/middleware/authenticate';
import { db } from '../../../src/services';
import { schemas } from '../../fixtures';
import { Unauthorized, MethodNotAllowed, BadRequest, NotAcceptable } from 'http-errors';

let token;

test.before('connect', async t => {
  await db(schemas, process.env.RETHINKDB_URL, process.env.RETHINKDB_NAME).start();
  t.truthy(db().conn, 'connection is present');

  const table = await db().clearTable(process.env.AUTHENTICATE_TABLE);

  t.is(table, true, 'table (dummy) successfully cleared');
});

test('Cannot find user', async t => {
  const assertCannotFindUser = res => (
    t.truthy(res instanceof BadRequest, 'Could not find user.')
  );

  await run({
    request: {
      path: '/auth/token',
      method: 'POST',
      body: {
        email: 'nowhere@test.com',
        password: 'not-there-password',
      },
    },
    response: {
      status: '',
      body: {
        token: '',
      },
    },
  }, assertCannotFindUser, db);
});

test('invalid method', async t => {
  const assertInvalidMethod = res => (
    t.truthy(res instanceof MethodNotAllowed, 'Invalid method.')
  );

  await run({
    request: {
      method: 'invalid-method',
    },
    response: {
      status: '',
    },
  }, assertInvalidMethod, db);
});

test('invalid path', async t => {
  const assertInvalidPath = res => (
    t.truthy(res instanceof BadRequest, 'Invalid path.')
  );

  await run({
    request: {
      path: 'invalid-path',
      method: 'POST',
    },
    response: {
      status: '',
    },
  }, assertInvalidPath, db);
});

test('authenticate process', async t => {
  const noSignupPassword = await run({
    request: {
      path: '/auth/signup',
      method: 'POST',
      body: {
        email: 'dummy@test.com',
        password: '',
      },
    },
    response: {
      status: '',
      body: {
        token: '',
      },
    },
  });

  t.truthy(noSignupPassword instanceof NotAcceptable, 'User signup plaintext password is empty.');

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

  const invalidToken = await run({
    request: {
      path: '/auth/verify',
      method: 'POST',
      body: {
        token: 'invalid-token',
      },
    },
    response: {
      status: '',
      body: {
        token: '',
      },
    },
  });

  t.truthy(invalidToken instanceof Unauthorized, 'Token is invalid, user is unauthorized.');

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

  const emptyPassword = res => (
    t.truthy(res instanceof NotAcceptable, 'User plaintext password is empty.')
  );

  await run({
    request: {
      path: '/auth/token',
      method: 'POST',
      body: {
        email: 'dummy@test.com',
        password: '',
      },
    },
    response: {
      status: '',
      body: {
        token: '',
      },
    },
  }, emptyPassword, db);

  const wrongPassword = res => (
    t.truthy(res instanceof NotAcceptable, 'User plaintext password is incorrect.')
  );

  await run({
    request: {
      path: '/auth/token',
      method: 'POST',
      body: {
        email: 'dummy@test.com',
        password: 'not-the-Password',
      },
    },
    response: {
      status: '',
      body: {
        token: '',
      },
    },
  }, wrongPassword, db);
});

test.after.always('teardown', async () => {
  await db().disconnect();
});
