import { find } from 'redink';
import { forEach } from 'lodash';
import excel from 'excel-export';

/**
 * Export company table
 *
 **/
export default () => {
  const fields = [
    'name',
    'street',
    'streetTwo',
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
    'contactPerson',
    'lastOnlinePurchase',
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

    return find('company', {}, {
      limit,
      skip,
      without: {
        people: true,
        listings: true,
        ads: true,
      },
    })
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
