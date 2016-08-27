// import { validateRequestWithToken } from '../utils/';

import {
  USER,
  COMPANY,
  AD,
  PERSON,
  BRAND,
  CATEGORY,
  FORM,
} from '../../../../constants/entities';

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
      // Authorize the request to GET one price.
      return Promise.resolve(true);

    default:
      return Promise.reject({
        message: `Not authorized to GET table  '${table}'.`,
      });
  }
};
