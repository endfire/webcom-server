import applyHooks from '../../../helpers/applyHook';
import test from 'ava';
import request from 'supertest-as-promised';

applyHooks(test);

const host = 'http://localhost';

let token;
let brandObject;

test('Integration: Post, patch, and delete from api', async t => {
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
    .then(res => {
      brandObject = res.body;
      return res;
    });

  t.is(createBrand.status, 200, 'Created a brand');

  const newBrand = {
    name: 'New brand',
    image: {
      img: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      publicId: brandObject.image.publicId,
    },
  };

  const patchBrand = await request(`${host}:${t.context.port}/api`)
    .patch(`/brand/${brandObject.id}`)
    .set('content-type', 'application/json')
    .set('authorization', token)
    .send(JSON.stringify(newBrand))
    .then(res => {
      brandObject = res.body;
      return res;
    });

  t.is(patchBrand.status, 200, 'Patched a brand');
  t.deepEqual(patchBrand.body.name, 'New brand');

  const deleteBrand = await request(`${host}:${t.context.port}/api`)
    .delete(`/brand/${brandObject.id}`)
    .set('content-type', 'application/json')
    .set('authorization', token)
    .send()
    .then(res => res);

  t.is(deleteBrand.status, 200, 'Deleted a brand');
});
