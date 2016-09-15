import { validateRequestWithToken } from '../utils/';
import * as entities from '../../../../constants/entities';
import { ensureUserRole, ensureUserRoleOrCompany } from '../checks/';

export default (ctx) => {
  const { request: { header }, params: { table } } = ctx;
  const { authorization } = header;
  let rules;

  switch (table) {
    case entities.USER:
    case entities.COMPANY:
    case entities.AD:
    case entities.BRAND:
    case entities.CATEGORY:
    case entities.FORM:
    case entities.FIELD:
    case entities.PAYMENT:
    case entities.ITEM:
      rules = [ensureUserRole];
      return validateRequestWithToken(rules, ctx, authorization);

    case entities.LISTING:
    case entities.PERSON:
      rules = [ensureUserRoleOrCompany];
      return validateRequestWithToken(rules, ctx, authorization);

    default:
      return Promise.reject({
        message: `Not authorized to DELETE table '${table}'.`,
      });
  }
};
