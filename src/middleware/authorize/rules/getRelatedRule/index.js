import { validateRequestWithToken } from '../utils/';
import * as entities from '../../../../constants/entities';
import { verified } from '../checks/';

export default (ctx) => {
  const { request, params: { table } } = ctx;
  const { header: { authorization } } = request;
  let rules;

  switch (table) {
    case entities.COMPANY:
    case entities.BRAND:
      rules = [verified];
      return validateRequestWithToken(rules, ctx, authorization);

    case entities.CATEGORY:
    case entities.FORM:
      return Promise.resolve(true);

    default:
      return Promise.reject({
        message: `Not authorized to GET table  '${table}'.`,
      });
  }
};
