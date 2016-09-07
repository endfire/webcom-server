/* eslint-disable no-param-reassign */
import authenticate from './authenticate';
import authorize from './authorize';
import read from './read';
import write from './write';
import download from './download';
import start from './start';

export const writeMiddleware = [start, authorize, write];
export const readMiddleware = [start, authorize, read];
export const authenticateMiddleware = [start, authenticate];
export const downloadMiddleware = [authorize, download];
