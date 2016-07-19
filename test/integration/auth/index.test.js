import test from 'ava';
import request from 'supertest-as-promised';
import redink from 'redink';
import r from 'rethinkdb';
import schemas from '../../../src/schemas';

const url = process.env.AUTH_URL;
let token;

test.before('Integration: Signup to authenticate', async t => {
  const options = {
    host: process.env.RETHINKDB_URL,
    name: process.env.RETHINKDB_NAME,
    schemas,
  };

  const conn = await redink().start(options);

  t.truthy(conn, 'connection is present');

  const table = await r.table(process.env.AUTHENTICATE_TABLE).delete().run(conn);

  t.truthy(table, 'table (dummy) successfully cleared');

  await redink().stop();

  const signup = await request(url)
    .post('/signup')
    .set('content-type', 'application/json')
    .send(JSON.stringify({
      name: 'CJ',
      role: '1',
      email: 'cj@auth.com',
      password: `${process.env.INTEGRATION_PASSWORD}`,
    }));

  t.is(signup.status, 200);
  t.truthy(signup.body.token, 'Contains the token');
  token = signup.body.token;
});

test('Integration: Returning user', async t => {
  const returning = await request(url)
    .post('/verify')
    .set('content-type', 'application/json')
    .send(JSON.stringify({ token }));

  t.is(returning.status, 202);
});

test('Integration: Login with wrong password', async t => {
  const passwordError = await request(url)
    .post('/token')
    .set('content-type', 'application/json')
    .send(JSON.stringify({
      email: 'cj@auth.com',
      password: 'Wrong password',
    }));

  t.is(passwordError.status, 406, 'Wrong password.');
});

test('Integration: Login with correct credentials', async t => {
  const login = await request(url)
    .post('/token')
    .set('content-type', 'application/json')
    .send(JSON.stringify({
      email: 'cj@auth.com',
      password: `${process.env.INTEGRATION_PASSWORD}`,
    }));

  t.is(login.status, 200);
  t.truthy(login.body.token, 'Contains the token');
});
