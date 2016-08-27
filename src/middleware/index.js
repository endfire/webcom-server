/* eslint-disable no-param-reassign */
import algolia from './algolia';
import authenticate from './authenticate';
import authorize from './authorize';
import image from './image';
import read from './read';
import write from './write';
import download from './download';

export const writeMiddleware = [authorize, image, write, algolia];
export const readMiddleware = [authorize, read];
export const authenticateMiddleware = [authenticate];
export const downloadMiddleware = [authorize, download];
