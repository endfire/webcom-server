/* eslint-disable no-console */
import redink from 'redink';
import schemas from './schemas';
import app from './application';

const {
    RETHINKDB_URL: host,
    RETHINKDB_NAME: name,
    PORT: port = 4200,
} = process.env;

const db = redink();

db.start({ schemas, host, name })
  .then(() => {
    app.listen(port);
    console.log(`Server started on port ${port}.`);
  })
  .catch(err => {
    throw err;
  });
