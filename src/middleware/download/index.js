import { RedinkHttpError } from 'redink-errors';
import { exportPeople, exportCompanies, exportSubmissions } from '../utils/export';

export default (ctx) => {
  const { params, response } = ctx;
  const { table, id } = params;

  const handleError = err => {
    throw new RedinkHttpError(400, `Error in download middleware: ${err.message}`);
  };

  if (!table) handleError(new RedinkHttpError(400, 'Table is undefined.'));

  response.set({
    'Content-Type': 'application/vnd.openxmlformats',
    'Content-Disposition': 'attachment; filename=test.xlsx',
  });

  switch (table) {
    case 'people':
      exportPeople().then(buffer => {
        response.body = buffer;
        return ctx;
      });
      break;
    case 'companies':
      exportCompanies().then(buffer => {
        response.body = buffer;
        return ctx;
      });
      break;
    case 'submissions':
      exportSubmissions(id).then(buffer => {
        response.body = buffer;
        return ctx;
      });
      break;
    default:
      handleError(new RedinkHttpError(400, `Download table '${table}' is not supported.`));
  }
};
