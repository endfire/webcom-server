import test from 'ava';
import algolia from '../../../src/middleware/algolia';

test('algolia', async t => {
  const assertPost = res => {
    t.truthy(res.createdAt, 'createdAt key is present');
    t.is(+res.objectID, 1, 'created object has correct id');
  };

  await algolia({
    request: {
      method: 'POST',
      body: {
        id: 1,
        name: 'Dylan',
        email: 'dylanslack@gmail.com',
        pets: [1, 2],
        company: 1,
      },
    },
  }, assertPost);

  const assertPatch = res => {
    t.truthy(res.updatedAt, 'updatedAt key is present');
    t.is(+res.objectID, 1, 'updated object has correct id');
  };

  await algolia({
    request: {
      method: 'PATCH',
      body: {
        id: 1,
        name: 'Dy-lon',
      },
    },
  }, assertPatch);

  const assertDelete = res => {
    t.truthy(res.deletedAt, 'deletedAt key is presrent');
    t.is(+res.objectID, 1, 'updated object has correct id');
  };

  await algolia({
    request: {
      method: 'DELETE',
      body: { id: 1 },
    },
  }, assertDelete);

  const assertInvalidMethod = res => t.falsy(res, 'should have no argument');

  await algolia({
    request: {
      method: 'invalid-method',
    },
  }, assertInvalidMethod);
});
