import test from 'ava';
import sanitizeRequest from '../../../src/services/database/sanitizeRequest';
import { schemas } from '../../fixtures';

test('sanitizeRequest', t => {
  const schema = schemas.user;

  t.deepEqual(sanitizeRequest(schema, {
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
    phone: '3033256597',
  }), {
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  }, '');
});
