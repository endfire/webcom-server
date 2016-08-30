import applyHooks from '../../../helpers/applyHook';
import test from 'ava';
import request from 'supertest-as-promised';

applyHooks(test);

const host = 'http://localhost';

let token;

test('should create a brand and category', async t => {
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

  const brand = {
    name: 'Test brand',
    image: {
      img: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    },
    background: '#FFF',
    text: '#333',
    secondary: '#AAA',
    obg: true,
    categories: [],
  };

  const createBrand = await request(`${host}:${t.context.port}/api`)
    .post('/brand')
    .set('content-type', 'application/json')
    .set('authorization', token)
    .send(JSON.stringify(brand))
    .then(res => res);

  t.is(createBrand.status, 200, 'Creaded a brand');
  t.is(createBrand.body.name, 'Test brand', 'Created a brand');

  const category = {
    name: 'Tester',
    heading: 'Test',
    brand: createBrand.body.id,
    listings: [],
    ads: [],
  };

  const createCategory = await request(`${host}:${t.context.port}/api`)
    .post('/category')
    .set('content-type', 'application/json')
    .set('authorization', token)
    .send(JSON.stringify(category))
    .then(res => res);

  t.is(createCategory.status, 200, 'Deleted a brand');
  t.is(createCategory.body.name, 'Tester', 'Deleted a brand');
  t.is(createCategory.body.brand.id, createBrand.body.id, 'Deleted a brand');

  const fetchBrand = await request(`${host}:${t.context.port}/api`)
    .get(`/brand/${createBrand.body.id}`)
    .set('authorization', token)
    .send()
    .then(res => res);

  t.deepEqual(fetchBrand.body.categories[0].id, createCategory.body.id, 'Fetched the Ad');
});
