import { find } from 'redink';
import { forEach } from 'lodash';
import excel from 'excel-export';

/**
 * Export people table
 *
 **/
export default () => {
  const fields = [
    'id',
    'name',
    'email',
    'phone',
    'title',
    'job',
    'lastUpdateDate',
    'webcomID',
    'companyID',
  ];

  const config = {
    cols: [],
    rows: [],
  };

  config.cols = fields.map(field => ({
    caption: field,
    type: 'general',
  }));

  const findMore = (limit, skip) => {
    let record;
    let input;

    return find('person', {}, {
      limit,
      skip,
      without: {
        company: {
          people: true,
          listings: true,
          ads: true,
        },
      },
    })
      .then(rows => {
        forEach(rows, row => {
          record = [];

          forEach(fields, field => {
            if (row[field]) {
              input = typeof row[field] === 'object'
                ? row[field].name
                : row[field];

              record.push(input);
            } else if (field === 'companyID') {
              input = row.company ? row.company.id : 'null';

              record.push(input);
            } else if (field === 'companyWebcomID') {
              input = row.company ? row.company.webcomID : 'null';

              record.push(input);
            } else record.push('null');
          });

          config.rows.push(record);
        });

        return rows.length;
      });
  };

  /* eslint-disable no-param-reassign */
  async function main(i) {
    const count = await findMore(10000, i);

    if (count < 10000) main((i += 10000));

    const exportFile = excel.execute(config);
    return Promise.resolve(new Buffer(exportFile, 'binary'));
  }

  return main(0);
};
