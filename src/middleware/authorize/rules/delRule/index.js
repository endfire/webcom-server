import { validateRequestWithToken } from '../utils/';

import {
  USER,
  COMPANY,
  AD,
  PERSON,
  BRAND,
  CATEGORY,
  FORM,
} from '../../../../constants/entities';

import { ensureCorrectUser } from '../checks/';

export default (ctx) => {
  const { request: { header }, params: { table } } = ctx;
  const { authorization } = header;
  let rules;

  switch (table) {
    case USER:
    case COMPANY:
    case AD:
    case PERSON:
    case BRAND:
    case CATEGORY:
    case FORM:
      // Check and ensure user is part of the practice.
      rules = [ensureCorrectUser];
      return validateRequestWithToken(rules, ctx, authorization);

    default:
      return Promise.reject({
        message: `Not authorized to DELETE table  '${table}'.`,
      });
  }
};
