import { find } from 'redink';
import { forEach } from 'lodash';

/**
 * Export company table
 *
 **/
export default () => {
  const fields = [
    'id',
    'name',
    'street',
    'city',
    'state',
    'zip',
    'country',
    'phone',
    'fax',
    'url',
    'email',
    'description',
    'lastContacted',
    'approved',
    'createdOn',
    'webcomID',
    'lastUpdated',
    'yearEstablished',
    'numberEmployees',
    'annualRevenue',
    'businessOwnership',
    'contactInfo',
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

    return find('company', {}, { limit, skip })
      .then(rows => {
        forEach(rows, row => {
          record = [];

          forEach(fields, field => {
            if (row[field]) {
              input = row[field];

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
