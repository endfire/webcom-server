import test from 'ava';
import { run } from '../../../src/middleware/authenticate';
import redink from 'redink';
import r from 'rethinkdb';
import { schemas } from '../../fixtures';

let token;

test.before('Authenticate: Connect to database', async t => {
  const options = {
    host: process.env.RETHINKDB_URL,
    name: process.env.RETHINKDB_NAME,
    schemas,
  };

  const conn = await redink().start(options);

  t.truthy(conn, 'connection is present');

  const table = await r.table(process.env.AUTHENTICATE_TABLE).delete().run(conn);

  t.truthy(table, 'table (dummy) successfully cleared');
});

test('Authenticate: Cannot find user', async t => {
  const assertCannotFindUser = res => (
    t.is(res.status, 404, 'Could not find user.')
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
  }, assertCannotFindUser);
});

test('Authenticate: Invalid method', async t => {
  const assertInvalidMethod = res => (
    t.is(res.status, 405, 'Invalid method.')
  );

  await run({
    request: {
      method: 'invalid-method',
    },
    response: {
      status: '',
    },
  }, assertInvalidMethod);
});

test('Authenticate: Invalid path', async t => {
  const assertInvalidPath = res => (
    t.is(res.status, 400, 'Invalid path.')
  );

  await run({
    request: {
      path: 'invalid-path',
      method: 'POST',
    },
    response: {
      status: '',
    },
  }, assertInvalidPath);
});

test('Authenticate: Signup, return and login', async t => {
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

  t.is(noSignupPassword.status, 406, 'User signup plaintext password is empty.');

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
  }, assertSignup);

  const assertVerify = res => t.is(res.status, 202);

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
  }, assertVerify);

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

  t.is(invalidToken.status, 401, 'Token is invalid, user is unauthorized.');

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
  }, assertToken);

  const emptyPassword = res => (
    t.is(res.status, 406, 'User plaintext password is empty.')
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
  }, emptyPassword);

  const wrongPassword = res => (
    t.is(res.status, 406, 'User plaintext password is incorrect.')
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
  }, wrongPassword);
});

test.after.always('Authenticate: Teardown database', async () => {
  await redink().stop();
});
