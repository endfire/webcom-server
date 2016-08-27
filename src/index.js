/* eslint-disable no-console */
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import Koa from 'koa';
import redink from 'redink';
import Router from 'koa-router';
import schemas from './schemas';
import routes, { configureRoutes } from './routes';
import * as verbs from './constants/http';

const {
    RETHINKDB_URL: host,
    RETHINKDB_NAME: name,
    PORT: port = 4200,
} = process.env;

const options = {
  schemas,
  host,
  name,
};

const app = new Koa();
const router = new Router();
const db = redink();

app.use(cors({
  origin: '*',
  allowMethods: [verbs.GET, verbs.PATCH, verbs.POST, verbs.DELETE],
}));

app.use(bodyParser());
configureRoutes(router, routes);
app.use(router.routes());

db.start(options)
  .then(() => {
    app.listen(port);
    console.log(`Server started on port ${port}.`);
  })
  .catch(err => {
    throw err;
  });
