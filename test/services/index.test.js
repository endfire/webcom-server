import test from 'ava';
import { db } from '../../src/services';
import { schemas } from '../fixtures';

test('database singleton', t => {
  db(schemas, '107.170.131.151', 'test').start();

  const first = db();
  const second = db();

  t.true(first === second, 'both vars are the same db instance');
});
