/* eslint-disable */
import * as types from '../../../../constants/entities';

export default (ctx) => {
  const { params: { table } } = ctx;

  switch (table) {
    case USER:
    case COMPANY:
    case AD:
    case PERSON:
    case BRAND:
    case CATEGORY:
    case FORM:
    case SUBMISSION:
      // TODO: Need to differentiate between user and company
      // If company, ensure correct company id
      // If user, then can get all of anything
      return Promise.resolve(true);

    default:
      // Throw error not allowed to get all of this entity
      return Promise.reject({
        message: `Not authorized to GET table  '${table}.'`,
      });
  }
};
