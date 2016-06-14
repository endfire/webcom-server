import test from 'ava';
import normalizeTableName from '../../../src/services/database/normalizeTableName';
import { schemas } from '../../fixtures';

test('normalizeTableName', t => {
  t.is(normalizeTableName(schemas, 'user'), 'users', '`user` is normalized correctly');
  t.is(normalizeTableName(schemas, 'books'), 'books', '`books` is normalized correctly');
});
