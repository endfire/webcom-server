/* eslint-disable */
import { validateRequestWithToken } from '../utils/';
import * as types from '../../../../constants/entities';

export default (ctx) => {
  const { request, params: { table } } = ctx;
  const { header: { authorization } } = request;
  // let rules;

  console.log(authorization);

  switch (table) {
    case USER:
    case COMPANY:
    case AD:
    case PERSON:
    case BRAND:
    case CATEGORY:
    case FORM:
    case SUBMISSION:
      // TODO: Need to differentiate between user and company
      // If company, ensure correct company id
      // If user, then can get one of anything
      return Promise.resolve(true);

    default:
      return Promise.reject({
        message: `Not authorized to GET table  '${table}'.`,
      });
  }
};
