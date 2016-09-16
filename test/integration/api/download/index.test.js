import applyHooks from '../../../helpers/applyHook';
import test from 'ava';
import request from 'supertest-as-promised';

applyHooks(test);

const host = 'http://localhost';

let token;

test.skip('should login and download the people file', async t => {
  const login = await request(`${host}:${t.context.port}/auth`)
    .post('/token')
    .set('content-type', 'application/json')
    .set('user-type', 'user')
    .send(JSON.stringify({
      email: 'marsha@webcom.com',
      password: 'testman',
    }));

  t.is(login.status, 200);
  t.truthy(login.body.token, 'Contains the token');
  t.truthy(login.body.user, 'Contains the user');

  token = login.body.token;

  const file = await request(`${host}:${t.context.port}/api`)
    .post('/download/people')
    .set('authorization', token)
    .send();

  t.is(file.status, 200);
  t.is(file.header['content-type'], 'application/vnd.openxmlformats', 'Downloaded file');
  t.is(file.buffered, true, 'Downloaded file');
});
