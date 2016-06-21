import test from 'ava';
import jwt from 'jsonwebtoken';
import authorize from '../../../src/middleware/authorize';
import { Unauthorized } from 'http-errors';

test('authorize', async t => {
  const token = jwt.sign({ password: 'test' }, process.env.JWT_KEY);

  const missingKey = await authorize({
    request: {
      header: {
        wrongkey: token,
      },
    },
    response: {},
  });

  t.truthy(missingKey instanceof Unauthorized, 'its an unauthorized error');

  const assertCall = res => t.is(res, 202, 'request authorized');

  await authorize({
    request: {
      header: {
        authorization: token,
      },
    },
    response: {},
  }, assertCall);

  const invalidToken = await authorize({
    request: {
      header: {
        authorization: 'invalid-token',
      },
    },
    response: {},
  });

  t.truthy(invalidToken instanceof Unauthorized, 'its an unauthorized error');
});
