import { find } from 'redink';
import { forEach } from 'lodash';
import excel from 'excel-export';

/**
 * Export company table
 *
 **/
export default (counter) => {
  const fields = [
    'id',
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
            } else record.push('');
          });

          config.rows.push(record);
        });

        return rows.length;
      });
  };

  async function main(i) {
    await findMore(10000, i);

    const exportFile = excel.execute(config);
    return Promise.resolve(new Buffer(exportFile, 'binary'));
  }

  return main(counter);
};
