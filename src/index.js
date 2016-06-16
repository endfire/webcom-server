/* eslint-disable no-console */
import Koa from 'koa';
import Router from 'koa-router';
import routes from './routes';
import schemas from './schemas';
import { configureRoutes } from './utils';
import { db } from './services';

const {
  RETHINKDB_URL: host,
  PORT: port = 3000,
} = process.env;

const app = new Koa();
const router = new Router();

configureRoutes(router, routes);

app.use(router.routes());
app.listen(port, () => {
  console.log(`Server started on port ${port}.`);

  db(schemas, host, 'webcom').start()
    .then(() => console.log('Database is ready.'))
    .catch(({ message }) => console.error('Database failed to connect: ', message));
});
