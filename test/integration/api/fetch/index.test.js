import applyHooks from '../../../helpers/applyHook';
import test from 'ava';
import request from 'supertest-as-promised';

applyHooks(test);

const host = 'http://localhost';

let token;

test('should fetch the record with populated relationships', async t => {
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

  const expectedAd = {
    id: '1',
    name: 'Ad 1',
    image: 'http://image.com',
    url: 'https://google.com',
    start: 'Today',
    end: 'Tomorrow',
    priority: '5',
    company: {
      id: '1',
      name: 'Company One',
      street: '123 S. Me Lane',
      city: 'Littleton',
      state: 'CO',
      zip: '80122',
      phone: '3031234567',
      url: 'http://me.com',
      email: 'test@company.com',
      description: 'Hello World',
      password: '$2a$10$McSj/jcx9csunmv47hp.9eJTwA2LLrs.hb115ccXzWZe6WE7KVo6G',
      listings: ['1', '2'],
      ads: ['1', '2'],
      people: ['1', '2'],
      meta: {
        archived: false,
      },
    },
    categories: [{
      id: '1',
      name: 'A16Z',
      heading: 'Venture',
      brand: '1',
      listings: ['1'],
      ads: ['1'],
      meta: {
        archived: false,
      },
    }],
    meta: {
      archived: false,
    },
  };

  const fetchAd = await request(`${host}:${t.context.port}/api`)
    .get('/ad/1')
    .set('authorization', token)
    .send()
    .then(res => res);

  t.deepEqual(fetchAd.body.company.name, expectedAd.company.name, 'Fetched the Ad');
  t.deepEqual(fetchAd.body.categories.name, expectedAd.categories.name, 'Fetched the Ad');
  t.deepEqual(fetchAd.body.name, expectedAd.name, 'Fetched the Ad');
});
