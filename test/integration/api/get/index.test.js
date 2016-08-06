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
    .set('auth-table', 'user')
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
  const brand = {
    name: 'Get brand',
    image: {
      img: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    },
    background: '#FFF',
    text: '#333',
    secondary: '#AAA',
  };

  const createBrand = await request(url)
    .post('/brand')
    .set('content-type', 'application/json')
    .set('authorization', token)
    .send(JSON.stringify(brand));

  t.is(createBrand.status, 202, 'Created a brand');
});
