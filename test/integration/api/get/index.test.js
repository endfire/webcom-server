import test from 'ava';
import request from 'supertest-as-promised';
import redink from 'redink';
import r from 'rethinkdb';
import schemas from '../../../../src/schemas';

const url = process.env.API_URL;
const auth = process.env.AUTH_URL;

let token;

test.before('Integration: Signup to authorize', async t => {
  const options = {
    host: process.env.RETHINKDB_URL,
    name: process.env.RETHINKDB_NAME,
    schemas,
  };

  const conn = await redink().start(options);

  t.truthy(conn, 'connection is present');

  const table = await r.table(process.env.AUTHENTICATE_TABLE).delete().run(conn);

  t.truthy(table, 'table (dummy) successfully cleared');

  await redink().stop();

  const signup = await request(auth)
    .post('/signup')
    .set('content-type', 'application/json')
    .send(JSON.stringify({
      name: 'CJ',
      role: '1',
      email: 'cj@get.com',
      password: `${process.env.INTEGRATION_PASSWORD}`,
    }));

  t.is(signup.status, 200);
  t.truthy(signup.body.token, 'Contains the token');
  token = signup.body.token;
});

test('Integration: Post and get relationships from api', async t => {
  let brandObject;
  let obgObject;

  const brand = {
    name: 'Get brand',
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

  const obg = {
    brand: brandObject.id,
  };

  const createOBG = await request(url)
    .post('/obg')
    .set('content-type', 'application/json')
    .set('authorization', token)
    .send(JSON.stringify(obg))
    .then(res => {
      obgObject = res.body;
      return res;
    });

  t.is(createOBG.status, 202, 'Created an obg');

  const getOBG = await request(url)
    .get(`/obg/${obgObject.id}`)
    .set('content-type', 'application/json')
    .set('authorization', token)
    .send()
    .then(res => {
      obgObject = res.body;
      return res;
    });

  t.is(getOBG.status, 202, 'Got the obg');
});
