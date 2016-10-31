import { find } from 'redink';
import { forEach } from 'lodash';
import excel from 'excel-export';

/**
 * Export people table
 *
 **/
export default (counter) => {
  const fields = [
    'id',
    'name',
    'email',
    'phone',
    'title',
    'job',
    'lastUpdateDate',
    'companyID',
  ];

  const config = {
    cols: [],
    rows: [],
  };

  config.cols = fields.map(field => ({
    caption: field,
    type: 'string',
  }));

  const findMore = (limit, skip) => (
    find('person', {}, {
      limit,
      skip,
      pluck: {
        id: true,
        name: true,
        email: true,
        phone: true,
        title: true,
        job: true,
        lastUpdateDate: true,
        company: {
          id: true,
        },
      },
    })
      .then(rows => {
        forEach(rows, row => {
          const record = [];

          forEach(fields, field => {
            let input;

            if (row[field]) {
              input = typeof row[field] === 'object'
                ? row[field].name
                : row[field];

              record.push(input);
            } else if (field === 'companyID') {
              input = row.company ? row.company.id : 'N/A';

              record.push(input);
            } else record.push('');
          });

          config.rows.push(record);
        });

        return rows.length;
      })
  );

  async function main(i) {
    await findMore(10000, i);

    const exportFile = excel.execute(config);
    return Promise.resolve(new Buffer(exportFile, 'binary'));
  }

  return main(counter);
};
