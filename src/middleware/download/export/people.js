import { find } from 'redink';
import { forEach } from 'lodash';

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
    'company',
    'companyID',
    'companyWebcomID',
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

    return find('person', {}, { limit, skip })
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

        return rows.count;
      });
  };

  async function main() {
    const count = await findMore(1000, 0);

    for (let i = 1000; i < count; i += 1000) {
      await findMore(1000, i);
    }

    return Promise.resolve(config);
  }

  return main();
};
