import { fetch } from 'redink';

export default ({ ctx, token }) => {
  const { params } = ctx;

  if (token.role === '1') return true;

  return fetch(params.table, params.id)
    .then(record => {
      if (record.company && record.company.id === token.id) return true;
      return false;
    })
    .catch(err => {
      throw err;
    });
};
