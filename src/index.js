/* eslint-disable no-console */
import redink from 'redink';
import schemas from './schemas';
import app from './application';
require('babel-core/register');
require('babel-polyfill');

const {
    RETHINKDB_URL: host,
    RETHINKDB_NAME: name,
    REDINK_USER: user,
    REDINK_PASSWORD: password,
    PORT: port = 4200,
} = process.env;

const db = redink();

db.start({ schemas, host, name, user, password })
  .then(() => {
    app.listen(port);
    console.log(`Server started on port ${port}.`);
  })
  .catch(err => {
    console.log('I got an error');
    console.log(err);
    throw err;
  });
