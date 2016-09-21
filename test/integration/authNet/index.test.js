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
    }, {
      value: 'Billy',
      label: 'firstName',
    }, {
      value: 'Jones',
      label: 'lastName',
    }, {
      value: 'billy@jones.com',
      label: 'email',
    }],
    payment: {
      cardNumber: '4242424242424242',
      expMonth: '08',
      expYear: '22',
      cardCvc: '999',
      firstName: 'James',
      lastName: 'Jones',
      email: 'cbrewer@coervercolorado.com',
    },
    items: [{
      quantity: '0',
      price: '30',
    }, {
      quantity: '2',
      price: '20',
    }, {
      quantity: '1',
      price: '70',
    }],
    createdOn: 'Today',
    form: '1',
    name: 'Test form',
    recipientOne: 'brewercalvinj@gmail.com',
    recipientTwo: 'brewercalvinj@gmail.com',
    recipientThree: 'brewercalvinj@gmail.com',
  };

  const createSubmission = await request(`${host}:${t.context.port}/api`)
    .post('/submission')
    .set('content-type', 'application/json')
    .set('authorization', token)
    .send(JSON.stringify(submission))
    .then(res => res);

  t.is(createSubmission.status, 200);
});
