import { exportPeople, exportCompanies, exportSubmissions } from './export';
import { invalidRequestError } from '../utils';

export default (ctx, next) => {
  const { params, response } = ctx;
  const { downloadTable, id } = params;
  let dispatch;

  response.set({
    'Content-Type': 'application/vnd.openxmlformats',
    'Content-Disposition': 'attachment; filename=people.xlsx',
  });

  switch (downloadTable) {
    case 'people':
      dispatch = exportPeople();
      break;

    case 'companies':
      dispatch = exportCompanies();
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
