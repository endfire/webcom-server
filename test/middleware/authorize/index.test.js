import test from 'ava';
import jwt from 'jsonwebtoken';
import authorize from '../../../src/middleware/authorize';

test('Authorize: API call', async t => {
  const token = jwt.sign({ password: 'test' }, process.env.JWT_KEY);

  const missingKey = await authorize({
    request: {
      header: {
        wrongkey: token,
      },
    },
    response: {
      status: '',
    },
  });

  t.is(missingKey.status, 400, 'Authoriation header missing');

  const assertCall = res => t.is(res.status, 202, 'request authorized');

  await authorize({
    request: {
      header: {
        authorization: token,
      },
    },
    response: {
      status: '',
    },
  }, assertCall);

  const invalidToken = await authorize({
    request: {
      header: {
        authorization: 'invalid-token',
      },
    },
    response: {
      status: '',
    },
  });

  t.is(invalidToken.status, 401, 'Inpropper token');
});
