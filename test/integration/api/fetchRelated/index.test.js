import applyHooks from '../../../helpers/applyHook';
import test from 'ava';
import request from 'supertest-as-promised';

applyHooks(test);

const host = 'http://localhost';

let token;

test.only('should fetch the related company from the ad', async t => {
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
    listings: [{
      id: '1',
      name: 'A16Z',
      heading: 'Venture',
      brand: {
        id: '1',
        archived: false,
      },
      listings: [{
        id: '1',
        archived: false,
      }],
      ads: [{
        id: '1',
        archived: false,
      }],
      meta: {
        archived: false,
      },
    }, {
      id: '2',
      name: 'Acid',
      heading: 'Street',
      brand: {
        id: '1',
        archived: false,
      },
      listings: [{
        id: '1',
        archived: false,
      }],
      ads: [{
        id: '2',
        archived: false,
      }],
      meta: {
        archived: false,
      },
    }],
    ads: [{
      id: '1',
      name: 'Ad 1',
      image: 'http://image.com',
      url: 'https://google.com',
      start: 'Today',
      end: 'Tomorrow',
      priority: '5',
      company: {
        id: '1',
        archived: false,
      },
      categories: [{
        id: '1',
        archived: false,
      }],
      meta: {
        archived: false,
      },
    }, {
      id: '2',
      name: 'Ad 2',
      image: 'http://image.com',
      url: 'https://google.com',
      start: 'Today',
      end: 'Tomorrow',
      priority: '2',
      company: {
        id: '1',
        archived: false,
      },
      categories: [{
        id: '2',
        archived: false,
      }],
      meta: {
        archived: false,
      },
    }],
    people: [{
      id: '1',
      name: 'Billy Jean',
      email: 'billy@company.com',
      phone: '3031234567',
      job: 'Janitor',
      company: {
        id: '1',
        archived: false,
      },
      meta: {
        archived: false,
      },
    }, {
      id: '2',
      name: 'Sally Jean',
      email: 'sally@company.com',
      phone: '3031234567',
      job: 'CEO',
      company: {
        id: '1',
        archived: false,
      },
      meta: {
        archived: false,
      },
    }],
    meta: {
      archived: false,
    },
  };

  const fetchOneRelated = await request(`${host}:${t.context.port}/api`)
    .get('/ad/1/company')
    .set('authorization', token)
    .send()
    .then(res => res);

  console.log(fetchOneRelated.body);
  console.log('-------------');
  console.log(expectedAd);

  t.is(fetchOneRelated.body, expectedAd, 'Fetched the Ad');
});
