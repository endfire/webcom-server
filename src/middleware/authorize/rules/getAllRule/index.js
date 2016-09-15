import * as entities from '../../../../constants/entities';
import { verified } from '../checks/';
import { validateRequestWithToken } from '../utils/';

export default (ctx) => {
  const { request: { header }, params: { table } } = ctx;
  const { authorization } = header;
  let rules;

  switch (table) {
    case entities.USER:
    case entities.COMPANY:
    case entities.BRAND:
    case entities.FORM:
    case entities.PERSON:
      rules = [verified];
      return validateRequestWithToken(rules, ctx, authorization);

    default:
      // Throw error not allowed to get all of this entity
      return Promise.reject({
        message: `Not authorized to GET table  '${table}.'`,
      });
  }
};
