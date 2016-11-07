/* eslint-disable max-len */
import redink from 'redink';
import r from 'rethinkdb';
import { forEach } from 'lodash';
import excel from 'excel-export';
import moment from 'moment';

// test non payment: d885906e-9a1c-4b11-b3b4-75dc37670f9b
// test payment: 36afccc8-a091-4a3e-9b3b-eec5c19136c8

const query = (form, conn) => (
  r.table('submission')
    .getAll(form, { index: 'formId' })
    .coerceTo('array')
    .run(conn)
);

/**
 * Export submission table
 *
 **/
export default (form) => {
  const fields = [
    'createdOn',
    'transactionID',
    'items',
    'payment',
    'fields',
  ];

  const config = {
    cols: [],
    rows: [],
  };

  config.cols = fields.map(field => ({
    caption: field,
    type: 'string',
  }));

  const findMore = () => (
    query(form, redink().conn())
      .then(rows => {
        forEach(rows, row => {
          const record = [];

          forEach(fields, field => {
            // let input;
            if (field === 'fields' && row[field]) {
              const fieldInput = [];

              Object.keys(row[field]).forEach(f => {
                fieldInput.push(`${row[field][f].label} = ${row[field][f].value}`);
              });

              record.push(fieldInput.join(' | '));
            } else if (field === 'items' && row[field]) {
              const itemInput = [];

              Object.keys(row[field]).forEach(item => {
                if (row[field][item].quantity > 0) {
                  itemInput.push(
                    `${row[field][item].label}, ${row[field][item].quantity}, $${row[field][item].price * row[field][item].quantity}`
                  );
                }
              });

              record.push(itemInput.join(' | '));
            } else if (field === 'payment' && row[field] && Object.keys(row[field]).length > 1) {
              const paymentInput = [];

              paymentInput.push(`firstName = ${row[field].firstName}`);
              paymentInput.push(`lastName = ${row[field].lastName}`);
              paymentInput.push(`email = ${row[field].email}`);
              paymentInput.push(`phone = ${row[field].phone}`);
              paymentInput.push(`address = ${row[field].address}`);
              paymentInput.push(`city = ${row[field].city}`);
              paymentInput.push(`state = ${row[field].state}`);
              paymentInput.push(`zip = ${row[field].zip}`);
              paymentInput.push(`country = ${row[field].country}`);

              record.push(paymentInput.join(' | '));
            } else if (field === 'createdOn') {
              record.push(`${moment(row[field]).format('LLLL')}`);
            } else if (row[field] && field !== 'payment') {
              record.push(`${row[field]}`);
            } else record.push('N/A');
          });

          config.rows.push(record);
        });

        return rows.length;
      })
  );

  async function main() {
    await findMore();

    const exportFile = excel.execute(config);
    return Promise.resolve(new Buffer(exportFile, 'binary'));
  }

  return main();
};
