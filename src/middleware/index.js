/* eslint-disable no-param-reassign */
import compose from 'koa-compose';
import algolia from './algolia';
import authenticate from './authenticate';
import authorize from './authorize';
import image from './image';
import read from './read';
import write from './write';

export const writeMiddleware = compose([authorize, image, write, algolia]);
export const readMiddleware = compose([authorize, read]);
export const authenticateMiddleware = compose([authenticate]);
