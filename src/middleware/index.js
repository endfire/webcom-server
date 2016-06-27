/* eslint-disable no-param-reassign */
import compose from 'koa-compose';
import algolia from './algolia';
import authenticate from './authenticate';
import authorize from './authorize';
import image from './image';
import read from './read';
import write from './write';
import finish from './return';

export const writeMiddleware = compose([authorize, image, write, algolia, finish]);
export const readMiddleware = compose([authorize, read, finish]);
export const authenticateMiddleware = compose([authenticate]);
