import { find } from 'redink';
import { forEach } from 'lodash';
import excel from 'excel-export';

/**
 * Export companies table
 *
 **/
export default () => {
  const fields = [

  ];

  const config = {
    cols: [],
    rows: [],
  };

  config.cols = fields.map(field => ({
    caption: field,
    type: 'general',
  }));

  return new Promise(resolve => {
    let record;
    let input;

    find('person')
      .then(rows => {
        forEach(rows, row => {
          record = [];

          forEach(fields, field => {
            if (row[field]) {
              input = typeof row[field] === 'object'
                ? row[field].name
                : row[field];

              record.push(input);
            } else record.push('null');
          });

          config.rows.push(record);
        });
      })
      .then(() => {
        const exportFile = excel.execute(config);
        resolve(new Buffer(exportFile, 'binary'));
      });
  });
};
