import redink from 'redink';
import Server from 'redink-server';
import schemas from './schemas';
import application from './application';
import compose from 'koa-compose';
import createError from 'http-errors';

import { writeMiddleware,
         readMiddleware,
         authenticateMiddleware,
         downloadMiddleware } from './middleware';

const {
  RETHINKDB_URL: host,
  RETHINKDB_NAME: name,
  PORT: port = 3000,
} = process.env;

const exportMiddleware = compose(downloadMiddleware);

const customRoute = {
  '/api/download/:table': {
    post: exportMiddleware,
  },
};

const db = redink();
const server = new Server(
  writeMiddleware,
  readMiddleware,
  authenticateMiddleware,
  customRoute
);

const options = {
  server,
  host,
  name,
  schemas,
  port,
};

application(options, db)
  .start()
  .catch(err => createError('500', `Could not start webcom server: ${err.message}`));
