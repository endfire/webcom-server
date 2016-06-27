import test from 'ava';
import sanitizeRequest from '../../../src/services/database/sanitizeRequest';
import { schemas } from '../../fixtures';

test('Sanitize: Sanitize request', t => {
  const schema = schemas.individual;

  t.deepEqual(sanitizeRequest(schema, {
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
    phone: '3033256597',
  }), {
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  }, '');
});
