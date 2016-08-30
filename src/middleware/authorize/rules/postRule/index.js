/* eslint-disable */
import { validateRequestWithToken } from '../utils/';
import * as types from '../../../../constants/entities';

import { ensureCorrectUser } from '../checks/';

export default (ctx) => {
  const { request: { header }, params: { table } } = ctx;
  const { authorization } = header;
  let rules;

  switch (table) {
    case PRACTICE_PERMISSION:
    case COMPANY_PERMISSION:
    case ONBOARDING:
    case CARD:
      // FIXME: Need to secure practice and company permissions.
      // Check and ensure user's id is the current user's id.
      rules = [ensureCorrectUser];
      return validateRequestWithToken(rules, ctx, authorization);

    case INVOICE:
    case OFFICE:
    case PRICE:
    case PROVIDER:
      // Check and ensure user is part of the practice.
      rules = [];
      return validateRequestWithToken(rules, ctx, authorization);

    case PRACTICE:
      // FIXME: Need to secure practice posting.
      return Promise.resolve(true);
    case COMPANY:
      // FIXME: Need to secure practice posting.
      return Promise.resolve(true);

    default:
      return Promise.reject({
        message: `Not authorized to POST to table '${table}'.`,
      });
  }
};
