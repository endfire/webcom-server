import applyHooks from '../../../helpers/applyHook';
import test from 'ava';
import request from 'supertest-as-promised';

applyHooks(test);

const host = 'http://localhost';

let token;

test('should delete a company and it\'s relationships', async t => {
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

  const deleteCompany = await request(`${host}:${t.context.port}/api`)
    .delete('/company/1')
    .set('content-type', 'application/json')
    .set('authorization', token)
    .send()
    .then(res => res);

  t.is(deleteCompany.status, 200, 'Deleted a brand');
  t.truthy(deleteCompany.body.meta.archived, 'Deleted a brand');
  // FIXME: Need new Redink
  // t.truthy(deleteCompany.body.ads[0].meta.archived, 'Deleted a brand');
  // t.truthy(deleteCompany.body.listings[0].meta.archived, 'Deleted a brand');
  // t.truthy(deleteCompany.body.people[0].meta.archived, 'Deleted a brand');
});
