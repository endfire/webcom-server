import redink from 'redink';
import r from 'rethinkdb';
import { forEach } from 'lodash';
import excel from 'excel-export';

const query = (brandId, skip, conn) => (
  r.table('listing')
    .filter({ brandId })
    .merge(row => ({
      categories: row('categories').map(cat => (
        r.table('category')
          .get(cat('id'))
          .pluck({ name: true })
      )),
      company: r.table('company')
        .get(row('company')('id'))
        .pluck({ id: true }),
    }))
    .pluck({ categories: true, company: true, brand: true, brandId: true })
    .limit(1000)
    .skip(skip)
    .coerceTo('array')
    .run(conn)
);

/**
 * Export people table
 *
 **/
export default (brandId, counter) => {
  const fields = [
    'brand',
    'companyId',
    'categories',
  ];

  const config = {
    cols: [],
    rows: [],
  };

  config.cols = fields.map(field => ({
    caption: field,
    type: 'general',
  }));

  const findMore = () => {
    let record;
    let input;

    return query(brandId, counter, redink().conn())
      .then(rows => {
        forEach(rows, row => {
          record = [];

          forEach(fields, field => {
            if (field === 'brand') {
              input = row[field];
              record.push(input);
            } else if (field === 'companyId') {
              input = row.company ? row.company.id : 'N/A';
              record.push(input);
            } else if (field === 'categories') {
              input = row.categories
                ? row.categories.map(cat => cat.name).join(', ')
                : 'No categories';

              record.push(input);
            } else record.push('');
          });

          config.rows.push(record);
        });

        return rows.length;
      });
  };

  async function main() {
    await findMore();

    const exportFile = excel.execute(config);
    return Promise.resolve(new Buffer(exportFile, 'binary'));
  }

  return main();
};
