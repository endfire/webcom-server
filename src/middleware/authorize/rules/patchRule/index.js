import { validateRequestWithToken } from '../utils/';

import {
  INVOICE,
  OFFICE,
  PRICE,
  PROVIDER,
  PRACTICE,
  COMPANY,
  USER,
  ONBOARDING,
} from '../../../../constants/entities';

import {
  ensureCorrectUser,
  ensureMemberOfCompany,
} from '../checks/';

export default (ctx) => {
  const { request: { header }, params: { table } } = ctx;
  const { authorization } = header;
  let rules;

  switch (table) {
    case INVOICE:
    case OFFICE:
    case PRICE:
    case PROVIDER:
    case PRACTICE:
      // Check and ensure user is part of the practice.
      rules = [ensureMemberOfCompany];
      return validateRequestWithToken(rules, ctx, authorization);

    case COMPANY:
      // Check and ensure user is part of the company.
      rules = [ensureMemberOfCompany];
      return validateRequestWithToken(rules, ctx, authorization);

    case USER:
    case ONBOARDING:
      // Check and ensure user's id is the current user's id.
      rules = [ensureCorrectUser];
      return validateRequestWithToken(rules, ctx, authorization);

    default:
      return Promise.reject({
        message: `Not authorized to PATCH table  '${table}'.`,
      });
  }
};
