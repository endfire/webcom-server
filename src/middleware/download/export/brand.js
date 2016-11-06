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
    .skip(skip)
    .limit(1000)
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
    type: 'string',
  }));

  const findMore = (id, count) => (
    query(id, count, redink().conn())
      .then(rows => {
        forEach(rows, row => {
          const record = [];

          forEach(fields, field => {
            let input;
            if (field === 'brand') {
              input = row[field];
              record.push(`${input}`);
            } else if (field === 'companyId') {
              input = row.company ? row.company.id : 'N/A';
              record.push(`${input}`);
            } else if (field === 'categories') {
              input = row.categories
                ? row.categories.map(cat => cat.name).join(', ')
                : 'No categories';

              record.push(`${input}`);
            } else record.push('');
          });

          config.rows.push(record);
        });

        return rows.length;
      })
  );

  async function main(id, count) {
    await findMore(id, count);

    const exportFile = excel.execute(config);
    return Promise.resolve(new Buffer(exportFile, 'binary'));
  }

  return main(brandId, counter);
};
