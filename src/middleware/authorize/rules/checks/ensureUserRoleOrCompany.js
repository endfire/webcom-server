import { fetch } from 'redink';

export default ({ token, ctx }) => {
  const { params } = ctx;

  if (token.role) return true;

  return fetch(params.table, params.id)
    .then(record => {
      if (params.table === 'company' && record.id === token.id) return true;
      if (record.company && record.company.id === token.id) return true;
      return false;
    })
    .catch(err => {
      throw err;
    });
};
