import { validateRequestWithToken } from '../utils/';
import * as entities from '../../../../constants/entities';
import {
  ensureUserRole,
  ensureUserRoleOrCompanyCanCreate,
  ensureUserCanCreateUser,
} from '../checks/';

export default (ctx) => {
  const { request: { header }, params: { table } } = ctx;
  const { authorization } = header;
  let rules;

  switch (table) {
    case entities.FORM:
    case entities.FIELD:
    case entities.CATEGORY:
    case entities.BRAND:
    case entities.COMPANY:
    case entities.AD:
    case entities.PAYMENT:
      rules = [ensureUserRole];
      return validateRequestWithToken(rules, ctx, authorization);

    case entities.USER:
      // Check and ensure user is part of the practice.
      rules = [ensureUserCanCreateUser];
      return validateRequestWithToken(rules, ctx, authorization);

    case entities.LISTING:
    case entities.PERSON:
      rules = [ensureUserRoleOrCompanyCanCreate];
      return validateRequestWithToken(rules, ctx, authorization);

    case entities.SUBMISSION:
      return Promise.resolve(true);

    default:
      return Promise.reject({
        message: `Not authorized to POST to table '${table}'.`,
      });
  }
};
