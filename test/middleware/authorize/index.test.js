import test from 'ava';
import jwt from 'jsonwebtoken';
import authorize from '../../../src/middleware/authorize';

test('authorize', async t => {
  const assertCall = res => {
    t.is(res, 202, 'request authorized');
  };

  const token = jwt.sign({ password: 'test' }, process.env.JWT_KEY);

  await authorize({
    request: {
      header: {
        authorization: token,
      },
    },
    response: {},
  }, assertCall);

  const assertMissingKey = res => t.is(res, 403, 'request not authorized');

  await authorize({
    request: {
      header: {
        authenticate: token,
      },
    },
    response: {},
  }, assertMissingKey);

  const assertInvalidToken = res => t.is(res, 403, 'invalid token');

  await authorize({
    request: {
      header: {
        authorization: 'invalid-token',
      },
    },
    response: {},
  }, assertInvalidToken);
});
