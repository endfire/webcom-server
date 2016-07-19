import redink from 'redink';
import Server from 'redink-server';
import schemas from './schemas';
import application from './application';

import { writeMiddleware, readMiddleware, authenticateMiddleware } from './middleware';

const {
  RETHINKDB_URL: host,
  RETHINKDB_NAME: name,
  PORT: port = 3000,
} = process.env;

const db = redink();
const server = new Server(writeMiddleware, readMiddleware, authenticateMiddleware);

const options = {
  server,
  host,
  name,
  schemas,
  port,
};

application(options, db).start();
