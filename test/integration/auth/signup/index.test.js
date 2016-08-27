import test from 'ava';
import request from 'supertest-as-promised';

const url = process.env.AUTH_URL;
let userToken;
let companyToken;

test.before('should signup the user and return status of 200', async t => {
  const signupUser = await request(url)
    .post('/signup')
    .set('content-type', 'application/json')
    .set('user-type', 'user')
    .send(JSON.stringify({
      name: 'CJU',
      role: '1',
      email: 'cj@userverify.com',
      password: `${process.env.INTEGRATION_PASSWORD}`,
    }));

  t.is(signupUser.status, 200);
  t.truthy(signupUser.body.token, 'Contains the token');
  userToken = signupUser.body.token;

  const signupCompany = await request(url)
    .post('/signup')
    .set('content-type', 'application/json')
    .set('user-type', 'company')
    .send(JSON.stringify({
      name: 'CJC',
      email: 'cj@companyverify.com',
      password: `${process.env.INTEGRATION_PASSWORD}`,
    }));

  t.is(signupCompany.status, 200);
  t.truthy(signupCompany.body.token, 'Contains the token');
  companyToken = signupCompany.body.token;
});

test.only('should verify the user\'s token and return status of 200', async t => {
  const returning = await request(url)
    .post('/verify')
    .set('content-type', 'application/json')
    .set('user-type', 'user')
    .send(JSON.stringify({ token: userToken }));

  t.is(returning.status, 200);
  t.is(returning.body.email, 'cj@userverify.com');
});

test.only('should verify the company\'s token and return status of 200', async t => {
  const returning = await request(url)
    .post('/verify')
    .set('content-type', 'application/json')
    .set('user-type', 'company')
    .send(JSON.stringify({ token: companyToken }));

  t.is(returning.status, 200);
  t.is(returning.body.email, 'cj@companyverify.com');
});
