// import { verified } from '../checks/';
// import { validateRequestWithToken } from '../utils/';

export default (ctx) => {
  const { params: { downloadTable } } = ctx;
  // const { authorization } = header;
  // let rules;

  switch (downloadTable) {
    case 'people':
    case 'companies':
    case 'form':
      return Promise.resolve(true);
      /* rules = [verified];
      return validateRequestWithToken(rules, ctx, authorization);*/

    default:
      // Throw error not allowed to get all of this entity
      return Promise.reject({
        message: `Not authorized to download table '${downloadTable}.'`,
      });
  }
};
