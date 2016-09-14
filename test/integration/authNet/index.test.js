import applyHooks from '../../helpers/applyHook';
import test from 'ava';
import request from 'supertest-as-promised';

applyHooks(test);

const host = 'http://localhost';

let token;

test.only('should post a submission', async t => {
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

  const submission = {
    fields: [{
      value: 'Hello',
      label: 'World',
    }],
    payment: {
      amount: 2.99,
      cardNumber: '4242424242424242',
      expMonth: '08',
      expYear: '22',
      cardCvc: '999',
    },
    createdOn: 'Today',
    form: '1',
  };

  const createSubmission = await request(`${host}:${t.context.port}/api`)
    .post('/submission')
    .set('content-type', 'application/json')
    .set('authorization', token)
    .send(JSON.stringify(submission))
    .then(res => res);

  console.log('Create submission here', createSubmission.body);

  t.is(createSubmission.status, 200);
});
