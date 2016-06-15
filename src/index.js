/* eslint-disable no-console */
import Koa from 'koa';
import Router from 'koa-router';
import routes from './routes';
import schemas from './schemas';
import { configureRoutes } from './utils';
import { Database } from './services';

const host = process.env.RETHINKDB_URL;
const port = process.env.PORT || 3000;
const app = new Koa();
const router = new Router();
const db = new Database(schemas, { host, db: 'webcom' });

configureRoutes(router, routes);

app.use(router.routes());
app.listen(port, () => {
  console.log(`Server started on port ${port}.`);

  db.connect(host)
    .then(() => console.log('Database is ready.'))
    .catch(({ message }) => console.error('Database failed to connect: ', message));
});
