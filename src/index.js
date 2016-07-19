import Koa from 'koa';
import Router from 'koa-router';
import redink from 'redink';
import routes from './routes';
import schemas from './schemas';
import application from './application';

const {
  RETHINKDB_URL: host,
  RETHINKDB_NAME: name,
  PORT: port = 3000,
} = process.env;

const app = new Koa();
const router = new Router();

const db = redink();

const options = {
  app,
  router,
  routes,
  host,
  name,
  schemas,
  port,
};

application(options, db).start();
