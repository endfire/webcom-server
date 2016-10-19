import { exportPeople, exportCompanies, exportSubmissions } from './export';
import { invalidRequestError } from '../utils';
import qs from 'qs';

export default (ctx, next) => {
  const { params, response, request } = ctx;
  const { downloadTable, id } = params;
  const { querystring } = request;

  const query = qs.parse(querystring);
  const { counter } = query;

  let dispatch;

  response.set({
    'Content-Type': 'application/vnd.openxmlformats',
    'Content-Disposition': 'attachment; filename=people.xlsx',
  });

  switch (downloadTable) {
    case 'people':
      dispatch = exportPeople(Number(counter) || 0);
      break;

    case 'companies':
      dispatch = exportCompanies(Number(counter) || 0);
      break;

    case 'form':
      dispatch = exportSubmissions(id);
      break;

    default:
      invalidRequestError(`Download table '${downloadTable}' is not supported.`);
  }

  return dispatch
    .then(buffer => {
      console.log('Done with people export!');
      return (response.body = buffer);
    })
    .then(next);
};
