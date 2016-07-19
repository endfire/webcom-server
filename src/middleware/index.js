/* eslint-disable no-param-reassign */
import algolia from './algolia';
import authenticate from './authenticate';
import authorize from './authorize';
import image from './image';
import read from './read';
import write from './write';
import finish from './return';

export const writeMiddleware = [authorize, image, write, algolia, finish];
export const readMiddleware = [authorize, read, finish];
export const authenticateMiddleware = [authenticate];
