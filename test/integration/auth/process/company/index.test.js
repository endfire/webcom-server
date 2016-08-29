import applyHooks from '../../../../helpers/applyHook';
import test from 'ava';
import request from 'supertest-as-promised';

applyHooks(test);

const host = 'http://localhost';

let companyToken;

test('should signup a company and then verify their token', async t => {
  const signup = await request(`${host}:${t.context.port}/auth`)
    .post('/signup')
    .set('content-type', 'application/json')
    .set('user-type', 'company')
    .send(JSON.stringify({
      name: 'CJ',
      email: 'cj@company.com',
      password: 'testman',
    }));

  t.is(signup.status, 200);
  t.truthy(signup.body.token, 'Contains the token');
  companyToken = signup.body.token;

  const returning = await request(`${host}:${t.context.port}/auth`)
    .post('/verify')
    .set('content-type', 'application/json')
    .set('user-type', 'company')
    .send(JSON.stringify({ token: companyToken }));

  t.is(returning.status, 200);
  t.is(returning.body.email, 'cj@company.com');

  const login = await request(`${host}:${t.context.port}/auth`)
    .post('/token')
    .set('content-type', 'application/json')
    .set('user-type', 'company')
    .send(JSON.stringify({
      email: 'cj@company.com',
      password: 'testman',
    }));

  t.is(login.status, 200);
  t.truthy(login.body.token, 'Contains the token');
});
