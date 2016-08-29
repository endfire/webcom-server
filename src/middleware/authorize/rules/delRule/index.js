import { validateRequestWithToken } from '../utils/';

import {
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
    case COMPANY:
    case AD:
    case PERSON:
    case BRAND:
    case CATEGORY:
    case FORM:
      // TODO: Determine how to differentiate between user and company
      // If company, determine correct company
      // If user, determine correct user role
      rules = [ensureCorrectUser];
      return validateRequestWithToken(rules, ctx, authorization);

    default:
      return Promise.reject({
        message: `Not authorized to DELETE table '${table}'.`,
      });
  }
};
