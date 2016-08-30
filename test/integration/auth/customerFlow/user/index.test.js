import applyHooks from '../../../../helpers/applyHook';
import test from 'ava';
import request from 'supertest-as-promised';

applyHooks(test);

const host = 'http://localhost';

let userToken;

test('should signup a user and then verify their token', async t => {
  const signup = await request(`${host}:${t.context.port}/auth`)
    .post('/signup')
    .set('content-type', 'application/json')
    .set('user-type', 'user')
    .send(JSON.stringify({
      name: 'CJ',
      role: '1',
      email: 'cj@user.com',
      password: 'testman',
    }));

  t.is(signup.status, 200);
  t.truthy(signup.body.token, 'Contains the token');
  userToken = signup.body.token;

  const returning = await request(`${host}:${t.context.port}/auth`)
    .post('/verify')
    .set('content-type', 'application/json')
    .set('user-type', 'user')
    .send(JSON.stringify({ token: userToken }));

  t.is(returning.status, 200);
  t.is(returning.body.email, 'cj@user.com');

  const login = await request(`${host}:${t.context.port}/auth`)
    .post('/token')
    .set('content-type', 'application/json')
    .set('user-type', 'user')
    .send(JSON.stringify({
      email: 'cj@user.com',
      password: 'testman',
    }));

  t.is(login.status, 200);
  t.truthy(login.body.token, 'Contains the token');
});
