/* eslint-disable no-param-reassign */
import { forEach } from 'lodash';

const convert = (object) => {
  const { keys } = Object;

  forEach(keys(object), (key) => {
    if (typeof object[key] === 'object') convert(object[key]);
    object[key] = object[key] === 'true' ? true : object[key];
    object[key] = object[key] === 'false' ? false : object[key];
  });

  return object;
};

export default (object) => convert(object);
