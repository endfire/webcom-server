import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import Koa from 'koa';
import Router from 'koa-router';
import routes, { configureRoutes } from './routes';
import * as verbs from './constants/http';

const app = new Koa();
const router = new Router();

app.use(cors({
  origin: '*',
  allowMethods: [verbs.GET, verbs.PATCH, verbs.POST, verbs.DELETE],
}));

app.use(bodyParser());
configureRoutes(router, routes);
app.use(router.routes());

export default app;
