import test from 'ava';
import image from '../../../src/middleware/image';

test('image', async t => {
  let publicId;

  const assertPost = res => {
    t.truthy(res.image.img, 'secure_url key is present');
    t.truthy(res.image.publicId, 'publicId key is present');
    publicId = res.image.publicId;
  };

  await image({
    params: {
      table: 'brand',
    },
    response: {
      body: {},
    },
    request: {
      method: 'POST',
      body: {
        id: 12,
        name: 'Antenna',
        image: {
          img: 'https://directly.io/assets/images/hero2-4add9dccc9b36fe08d4dee2fd94acf7f.jpg',
        },
      },
    },
  }, assertPost);

  const assertPatch = res => {
    t.truthy(res.image.img, 'secure_url key is present');
    t.is(res.image.publicId, publicId, 'publicId key is the same');
  };

  await image({
    params: {
      table: 'brand',
    },
    response: {
      body: {},
    },
    request: {
      method: 'PATCH',
      body: {
        id: 12,
        name: 'Antenna',
        image: {
          img: 'https://directly.io/assets/images/hero1-65bccd28f7d2fac7bd171314f901304c.jpg',
          publicId,
        },
      },
    },
  }, assertPatch);

  const assertDelete = res => t.is(res, 'ok', 'image was deleted');

  await image({
    params: {
      table: 'brand',
    },
    response: {
      body: {},
    },
    request: {
      method: 'DELETE',
      body: {
        id: 12,
        name: 'Antenna',
        image: {
          img: 'https://directly.io/assets/images/hero1-65bccd28f7d2fac7bd171314f901304c.jpg',
          publicId,
        },
      },
    },
  }, assertDelete);

  const assertInvalidBody = res => t.falsy(res, 'body should have image object');

  await image({
    params: {
      table: 'brand',
    },
    response: {
      body: {},
    },
    request: {
      method: 'DELETE',
      body: {
        id: 12,
        name: 'Antenna',
      },
    },
  }, assertInvalidBody);

  const assertInvalidMethod = res => t.falsy(res, 'does not have proper method');

  await image({
    params: {
      table: 'brand',
    },
    response: {
      body: {},
    },
    request: {
      method: 'GET',
      body: {
        id: 12,
        name: 'Antenna',
        image: {
          img: 'https://directly.io/assets/images/hero1-65bccd28f7d2fac7bd171314f901304c.jpg',
          publicId,
        },
      },
    },
  }, assertInvalidMethod);
});
