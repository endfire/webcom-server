import { validateRequestWithToken } from '../utils/';
import * as entities from '../../../../constants/entities';
import { ensureUserRole, ensureUserRoleOrCompany } from '../checks/';

export default (ctx) => {
  const { request: { header }, params: { table } } = ctx;
  const { authorization } = header;
  let rules;

  switch (table) {
    case entities.FIELD:
    case entities.FORM:
    case entities.BRAND:
    case entities.CATEGORY:
    case entities.AD:
    case entities.ITEM:
      // Check and ensure user is part of the practice.
      rules = [ensureUserRole];
      return validateRequestWithToken(rules, ctx, authorization);

    case entities.COMPANY:
    case entities.LISTING:
    case entities.PERSON:
      // Check and ensure user is part of the company.
      rules = [ensureUserRoleOrCompany];
      return validateRequestWithToken(rules, ctx, authorization);

    default:
      return Promise.reject({
        message: `Not authorized to PATCH table '${table}'.`,
      });
  }
};
