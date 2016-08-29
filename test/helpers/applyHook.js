/* eslint-disable no-param-reassign */
import { init, cleanup } from 'ava-rethinkdb';
import redink from 'redink';
import { initData } from '../fixtures';
import schemas from '../../src/schemas';
import app from '../../src/application';

export default (test) => {
  let port;

  test.before('initialize', (t) => init(initData)(t).then(p => (port = p)));

  test.before('should start the seeded app and database', () => (
    redink()
      .start({
        schemas,
        name: 'test',
        host: 'localhost',
        port,
      })
      .then(() => {
        console.log(`Redink started on port: ${port}`);
        app.listen((port - 1000));
        console.log(`App started on port: ${port - 1000}`);
      })
      .catch(() => {
        console.error('I got an error');
      })
  ));

  test.beforeEach('set port', t => (
    t.context.port = port - 1000
  ));

  test.after.always('should teardown the database and app', () => (
    redink().stop().then(cleanup)
  ));
};
