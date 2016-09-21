import { exportPeople, exportCompanies, exportSubmissions } from './export';
import { invalidRequestError } from '../utils';
import excel from 'excel-export';
import email from 'emailjs/email';

const server = email.server.connect({
  user: 'infowebcomcommunications@gmail.com',
  password: process.env.EMAIL_PASSWORD,
  host: 'smtp.gmail.com',
  tls: { ciphers: 'SSLv3' },
});

export default (ctx, next) => {
  const { params, request } = ctx;
  const { downloadTable, id } = params;
  let dispatch;

  // const handleError = (err) => invalidRequestError(err.message);

  const handleConfig = (config, type) => {
    const exportFile = excel.execute(config);

    const message	= {
      text:	`Download of ${type}`,
      from:	'Webcom Communications <infowebcomcommunications@gmail.com>',
      to:	'CJ Brewer <brewercalvinj@gmail.com>',
      subject:	`${type} download`,
      attachment: [{
        data: new Buffer(exportFile, 'binary'),
        name: `${type}.xlsx`,
      }],
    };

    return new Promise((resolve) => {
      server.send(message, (err) => {
        console.log('Sent');
        console.log(err);
        request.body = (err || { message: 'Please check your email for the download.' });
        resolve();
      });
    });
  };

  switch (downloadTable) {
    case 'people':
      dispatch = exportPeople()
        .then(config => handleConfig(config, 'People'));
      break;

    case 'companies':
      dispatch = exportCompanies()
        .then(config => handleConfig(config, 'Companies'));
      break;

    case 'form':
      dispatch = exportSubmissions(id);
      break;

    default:
      invalidRequestError(`Download table '${downloadTable}' is not supported.`);
  }

  return dispatch.then(next);
};
