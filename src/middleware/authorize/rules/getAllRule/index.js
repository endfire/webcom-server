import {
  USER,
  COMPANY,
  AD,
  PERSON,
  BRAND,
  CATEGORY,
  FORM,
} from '../../../../constants/entities';

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
      // Authorize GET all offices for now.
      return Promise.resolve(true);

    default:
      // Throw error not allowed to get all of this entity
      return Promise.reject({
        message: `Not authorized to GET table  '${table}.'`,
      });
  }
};
