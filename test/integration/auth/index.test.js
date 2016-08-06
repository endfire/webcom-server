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
    .set('auth-table', 'user')
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
    .set('auth-table', 'user')
    .send(JSON.stringify({ token }));

  t.is(returning.status, 202);
});

test('Integration: Login with wrong password', async t => {
  try {
    await request(url)
      .post('/token')
      .set('content-type', 'application/json')
      .set('auth-table', 'user')
      .send(JSON.stringify({
        email: 'cj@auth.com',
        password: 'Wrong password',
      }));
  } catch (e) {
    t.is(e.message, 'Error in authenticate middleware: User not authenticated.', 'Not auth');
  }
});

test('Integration: Login with correct credentials', async t => {
  const login = await request(url)
    .post('/token')
    .set('content-type', 'application/json')
    .set('auth-table', 'user')
    .send(JSON.stringify({
      email: 'cj@auth.com',
      password: `${process.env.INTEGRATION_PASSWORD}`,
    }));

  t.is(login.status, 200);
  t.truthy(login.body.token, 'Contains the token');
});

test('Integration: Company login', async t => {
  const signup = await request(url)
    .post('/signup')
    .set('content-type', 'application/json')
    .set('auth-table', 'company')
    .send(JSON.stringify({
      name: 'CJ',
      email: 'cj@company.com',
      password: `${process.env.INTEGRATION_PASSWORD}`,
    }));

  t.is(signup.status, 200);
  t.truthy(signup.body.token, 'Contains the token');
  const companyToken = signup.body.token;

  const returning = await request(url)
    .post('/verify')
    .set('content-type', 'application/json')
    .set('auth-table', 'company')
    .send(JSON.stringify({ token: companyToken }));

  t.is(returning.status, 202);

  const login = await request(url)
    .post('/token')
    .set('content-type', 'application/json')
    .set('auth-table', 'company')
    .send(JSON.stringify({
      email: 'cj@company.com',
      password: `${process.env.INTEGRATION_PASSWORD}`,
    }));

  t.is(login.status, 200);
  t.truthy(login.body.token, 'Contains the token');
});
