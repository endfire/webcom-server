import test from 'ava';
import request from 'supertest-as-promised';
import { db } from '../../../../src/services';
import schemas from '../../../../src/schemas';

const url = process.env.API_URL;
const auth = process.env.AUTH_URL;

let token;

test.before('Integration: Signup to authorize', async t => {
  await db(schemas, process.env.RETHINKDB_URL, process.env.RETHINKDB_NAME).start();
  t.truthy(db().instance().conn, 'connection is present');

  const table = await db().instance().clearTable(process.env.AUTHENTICATE_TABLE);

  t.is(table, true, 'person table successfully cleared');

  await db().stop();

  const signup = await request(auth)
    .post('/signup')
    .set('content-type', 'application/json')
    .send(JSON.stringify({
      name: 'CJ',
      role: '1',
      email: 'cj@api.com',
      password: `${process.env.INTEGRATION_PASSWORD}`,
    }));

  t.is(signup.status, 200);
  t.truthy(signup.body.token, 'Contains the token');
  token = signup.body.token;
});

test('Integration: Post, patch, and delete from api', async t => {
  let brandObject;

  const brand = {
    name: 'Test brand',
    image: {
      img: 'https://directly.io/assets/images/hero1-65bccd28f7d2fac7bd171314f901304c.jpg',
    },
    background: '#FFF',
    text: '#333',
    secondary: '#AAA',
  };

  const createBrand = await request(url)
    .post('/brand')
    .set('content-type', 'application/json')
    .set('authorization', token)
    .send(JSON.stringify(brand))
    .then(res => {
      brandObject = res.body;
      return res;
    });

  t.is(createBrand.status, 202, 'Created a brand');

  const newBrand = {
    name: 'New brand',
    image: {
      img: 'https://directly.io/assets/images/hero2-4add9dccc9b36fe08d4dee2fd94acf7f.jpg',
      publicId: brandObject.image.publicId,
    },
  };

  const patchBrand = await request(url)
    .patch(`/brand/${brandObject.id}`)
    .set('content-type', 'application/json')
    .set('authorization', token)
    .send(JSON.stringify(newBrand))
    .then(res => {
      brandObject = res.body;
      return res;
    });

  t.is(patchBrand.status, 202, 'Patched a brand');

  const deleteBrand = await request(url)
    .delete(`/brand/${brandObject.id}`)
    .set('content-type', 'application/json')
    .set('authorization', token)
    .send(JSON.stringify(brandObject))
    .then(res => res);

  t.is(deleteBrand.status, 202, 'Deleted a brand');
});
