/* eslint-disable no-param-reassign */
import { fetch, find, fetchRelated } from 'redink';
import { invalidRequestError, invalidMethodError } from '../utils/';
import qs from 'qs';

/**
 * Middleware to read from the database based on the request params.
 *
 * @param {Object} ctx
 * @param {Function} next
 * @return {Function}
 */
export default (ctx, next) => {
  const { params, request } = ctx;
  const { table, id, field } = params;
  const { method, querystring } = request;
  const pagination = {
    limit: 80,
    skip: 0,
  };

  let dispatch;

  const query = qs.parse(querystring);

  if (query.limit || query.skip) {
    pagination.limit = Number(query.limit);
    pagination.skip = Number(query.skip);
    delete query.limit;
    delete query.skip;
  }

  if (method !== 'GET') {
    invalidMethodError(`Invalid method expecting GET but got '${method}'`);
  }

  const handleResponse = results => {
    request.body = results;
    return request;
  };

  const handleReadError = err => invalidRequestError(err.message);

  if (field) dispatch = fetchRelated(table, id, field, query, pagination);
  else if (id) dispatch = fetch(table, id);
  else dispatch = find(table, query, pagination);

  return dispatch
    .then(handleResponse)
    .then(next)
    .catch(handleReadError);
};
