import test from 'ava';
import { db } from '../../../src/services';
import { schemas } from '../../fixtures';

test.before('Database: Connect to database', async t => {
  await db(schemas, process.env.RETHINKDB_URL, process.env.RETHINKDB_NAME).start();
  t.truthy(db().instance().conn, 'connection is present');
});

test('Database: Create, read, update, delete with no relationships', async t => {
  let user;

  user = await db().instance().create('individual', {
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  });

  t.deepEqual(user, {
    id: user.id,
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  }, 'created user has correct json');

  user = await db().instance().fetch('individual', user.id);

  t.deepEqual(user, {
    id: user.id,
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  }, 'fetched user has correct json');

  user = await db().instance().update('individual', user.id, {
    name: 'Dy-lon',
  });

  t.deepEqual(user, {
    id: user.id,
    name: 'Dy-lon',
    email: 'dylanslack@gmail.com',
  }, 'updated user has correct json');

  user = await db().instance().delete('individual', user.id);

  t.is(user.deleted, true, 'user was successfully deleted');
});

test('Database: Fetch related', async t => {
  let expected;

  await db().instance().create('individual', {
    id: '10',
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
    pets: ['11', '12'],
    company: '13',
  });

  await db().instance().create('company', {
    id: '13',
    name: 'Apple',
    employees: ['10'],
  });

  await db().instance().create('animal', {
    id: '11',
    species: 'dog',
    color: 'brown',
    owner: '10',
  });

  await db().instance().create('animal', {
    id: '12',
    species: 'cat',
    color: 'black',
    owner: '10',
  });

  const pets = await db().instance().fetchRelated('individual', '10', 'pets');

  expected = [{
    id: '11',
    species: 'dog',
    color: 'brown',
    owner: {
      id: '10',
      name: 'Dylan',
      email: 'dylanslack@gmail.com',
      pets: ['11', '12'],
      company: '13',
    },
  }, {
    id: '12',
    species: 'cat',
    color: 'black',
    owner: {
      id: '10',
      name: 'Dylan',
      email: 'dylanslack@gmail.com',
      pets: ['11', '12'],
      company: '13',
    },
  }];

  t.deepEqual(pets, expected, 'fetched pets has correct json');

  const company = await db().instance().fetchRelated('individual', '10', 'company');

  expected = {
    id: '13',
    name: 'Apple',
    employees: [{
      id: '10',
      name: 'Dylan',
      email: 'dylanslack@gmail.com',
      pets: ['11', '12'],
      company: '13',
    }],
  };

  t.deepEqual(company, expected, 'fetched company has correct json');
});

test.after.always('Database: Teardown database', async () => {
  await db().stop();
});
