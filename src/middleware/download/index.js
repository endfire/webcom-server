import { exportPeople, exportCompanies, exportSubmissions } from './export';

export default (ctx, next) => {
  const { params, response } = ctx;
  const { table, id } = params;
  let dispatch;

  const handleError = (err) => {
    console.log(err);
    // throw new RedinkHttpError(400, `Error in download middleware: ${err.message}`);
  };

  if (!table) handleError(new Error('Table is undefined.'));

  response.set({
    'Content-Type': 'application/vnd.openxmlformats',
    'Content-Disposition': 'attachment; filename=test.xlsx',
  });

  switch (table) {
    case 'people':
      dispatch = exportPeople();
      break;

    case 'companies':
      dispatch = exportCompanies();
      break;

    case 'submissions':
      dispatch = exportSubmissions(id);
      break;

    default:
      handleError(new RedinkHttpError(400, `Download table '${table}' is not supported.`));
  }

  return dispatch
    .then(buffer => (response.body = buffer))
    .then(next);
};
