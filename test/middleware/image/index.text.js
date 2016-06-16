import test from 'ava';
import image from '../../../src/middleware/image';

test('image', async t => {
  const assertPost = res => {
    console.log(res);
    t.truthy(res.secure_url, 'secure_url key is present');
  };

  await image({
    method: 'post',
    params: {
      table: 'brand',
    },
    request: {
      body: {
        image: 'https://directly.io/assets/images/hero2-4add9dccc9b36fe08d4dee2fd94acf7f.jpg',
      },
    },
  }, assertPost);
});
