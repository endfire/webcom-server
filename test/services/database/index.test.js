import test from 'ava';
import { db } from '../../../src/services';
import { schemas } from '../../fixtures';

test.before('connect', async t => {
  await db(schemas, process.env.RETHINKDB_URL, 'webcom').start();
  t.truthy(db().conn, 'connection is present');
});

test('create, read, update, delete with no relationships', async t => {
  let user;

  user = await db().create('user', {
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  });

  t.deepEqual(user, {
    id: user.id,
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  }, 'created user has correct json');

  user = await db().fetch('user', user.id);

  t.deepEqual(user, {
    id: user.id,
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  }, 'fetched user has correct json');

  user = await db().update('user', user.id, {
    name: 'Dy-lon',
  });

  t.deepEqual(user, {
    id: user.id,
    name: 'Dy-lon',
    email: 'dylanslack@gmail.com',
  }, 'updated user has correct json');

  user = await db().delete('user', user.id);

  t.is(user, true, 'user was successfully deleted');
});

test('fetchRelated', async t => {
  let expected;

  await db().create('user', {
    id: '10',
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
    pets: ['11', '12'],
    company: '13',
  });

  await db().create('company', {
    id: '13',
    name: 'Apple',
    employees: ['10'],
  });

  await db().create('animal', {
    id: '11',
    species: 'dog',
    color: 'brown',
    owner: '10',
  });

  await db().create('animal', {
    id: '12',
    species: 'cat',
    color: 'black',
    owner: '10',
  });

  const pets = await db().fetchRelated('user', '10', 'pets');

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

  const company = await db().fetchRelated('user', '10', 'company');

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

test.after('teardown', async () => {
  await db().disconnect();
});
