/* eslint-disable no-param-reassign */
import algolia from 'redink-middleware-algolia';
import authenticate from 'redink-middleware-authenticate';
import authorize from 'redink-middleware-authorize';
import image from './image';
import read from 'redink-middleware-read';
import write from 'redink-middleware-write';
import download from './download';

export const writeMiddleware = [authorize, image, write, algolia];
export const readMiddleware = [authorize, read];
export const authenticateMiddleware = [authenticate];
export const downloadMiddleware = [authorize, download];
