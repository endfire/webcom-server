import test from 'ava';
import image from '../../../src/middleware/image';

test('Image: Post, patch, and delete', async t => {
  let publicId;

  const assertPost = res => {
    t.truthy(res.body.image.img, 'secure_url key is present');
    t.truthy(res.body.image.publicId, 'publicId key is present');
    publicId = res.body.image.publicId;
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
          img: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        },
      },
    },
  }, assertPost);

  const assertPatch = res => {
    t.truthy(res.body.image.img, 'secure_url key is present');
    t.is(res.body.image.publicId, publicId, 'publicId key is the same');
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
          img: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          publicId,
        },
      },
    },
  }, assertPatch);

  const assertDelete = res => t.is(res.body.result, 'ok', 'image was deleted');

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
          img: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
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
          img: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          publicId,
        },
      },
    },
  }, assertInvalidMethod);
});
