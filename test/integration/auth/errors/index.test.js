import applyHooks from '../../../helpers/applyHook';
import test from 'ava';
import request from 'supertest-as-promised';

applyHooks(test);

const host = 'http://localhost';

test('should throw an error with incorrect password for user', async t => {
  const login = await request(`${host}:${t.context.port}/auth`)
    .post('/token')
    .set('content-type', 'application/json')
    .set('user-type', 'user')
    .send(JSON.stringify({
      email: 'marsha@webcom.com',
      password: 'this is so wrong',
    }));

  t.is(login.status, 401, 'User not authenticated');
  t.is(login.body.message, 'Incorrect email and/or password.');
});

test('should throw an error with incorrect email', async t => {
  const login = await request(`${host}:${t.context.port}/auth`)
    .post('/token')
    .set('content-type', 'application/json')
    .set('user-type', 'user')
    .send(JSON.stringify({
      email: 'marsha@incorrect.com',
      password: 'testman',
    }));

  t.is(login.status, 401, 'User not authenticated');
  t.is(login.body.message, 'Incorrect email and/or password.');
});
