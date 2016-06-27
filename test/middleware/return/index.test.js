import test from 'ava';
import finish from '../../../src/middleware/return';

test('Finish: Return response to client', async t => {
  const object = await finish({
    response: {
      body: {},
    },
    request: {
      body: {
        name: 'CJ',
        text: 'Hello World',
      },
    },
  });

  t.deepEqual(object.body, {
    name: 'CJ',
    text: 'Hello World',
  });

  const nonObject = await finish({
    response: {
      body: {},
    },
    request: {
      body: 'Hello',
    },
  });

  t.deepEqual(nonObject.body, {
    status: 200,
  });
});
