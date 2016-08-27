/* eslint-disable no-console */
const r = require('rethinkdb');

let connection;

r.connect({
  host: process.env.RETHINKDB,
  db: 'test',
})
  .then(conn => {
    connection = conn;
    return r.do(
      r.table('obg').delete(),
      r.table('category').delete(),
      r.table('enterprise').delete(),
      r.table('listing').delete(),
      r.table('ad').delete(),
      r.table('employee').delete()
    ).run(connection);
  })
  .then(() => (
    r.table('obg').insert({
      id: '19',
      name: 'Antenna OBG',
      meta: {
        archived: false,
      },
      categories: [
        {
          id: '1129',
          archived: false,
        },
        {
          id: '1139',
          archived: false,
        },
      ],
    }).run(connection)
  ))
  .then(() => (
    r.do(
      r.table('category').insert({
        id: '1129',
        name: 'Category 1',
        meta: {
          archived: false,
        },
        obg: {
          id: '19',
          archived: false,
        },
        listings: [
          {
            id: '11119',
            archived: false,
          },
          {
            id: '22229',
            archived: false,
          },
        ],
        ads: [
          {
            id: '111109',
            archived: false,
          },
          {
            id: '222209',
            archived: false,
          },
        ],
      }),
      r.table('category').insert({
        id: '1139',
        name: 'Category 2',
        meta: {
          archived: false,
        },
        obg: {
          id: '19',
          archived: false,
        },
        listings: [
          {
            id: '11119',
            archived: false,
          },
          {
            id: '33339',
            archived: false,
          },
        ],
        ads: [
          {
            id: '111109',
            archived: false,
          },
          {
            id: '333309',
            archived: false,
          },
        ],
      })
    ).run(connection)
  ))
  .then(() => (
    r.do(
      r.table('enterprise').insert({
        id: '1009',
        name: 'Company 1',
        meta: {
          archived: false,
        },
        listings: [
          {
            id: '11119',
            archived: false,
          },
          {
            id: '22229',
            archived: false,
          },
        ],
        ads: [
          {
            id: '111109',
            archived: false,
          },
          {
            id: '222209',
            archived: false,
          },
        ],
      }),
      r.table('enterprise').insert({
        id: '2009',
        name: 'Company 2',
        meta: {
          archived: false,
        },
        listings: [
          {
            id: '33339',
            archived: false,
          },
        ],
        ads: [
          {
            id: '333309',
            archived: false,
          },
        ],
      })
    ).run(connection)
  ))
  .then(() => (
    r.do(
      r.table('listing').insert({
        id: '11119',
        meta: {
          archived: false,
        },
        company: {
          id: '1009',
          archived: false,
        },
        categories: [
          {
            id: '1129',
            archived: false,
          },
          {
            id: '1139',
            archived: false,
          },
        ],
      }),
      r.table('listing').insert({
        id: '22229',
        meta: {
          archived: false,
        },
        company: {
          id: '1009',
          archived: false,
        },
        categories: [
          {
            id: '1129',
            archived: false,
          },
        ],
      }),
      r.table('listing').insert({
        id: '33339',
        meta: {
          archived: false,
        },
        company: {
          id: '2009',
          archived: false,
        },
        categories: [
          {
            id: '1139',
            archived: false,
          },
        ],
      })
    ).run(connection)
  ))
  .then(() => (
    r.do(
      r.table('ad').insert({
        id: '111109',
        meta: {
          archived: false,
        },
        company: {
          id: '1009',
          archived: false,
        },
        categories: [
          {
            id: '1129',
            archived: false,
          },
          {
            id: '1139',
            archived: false,
          },
        ],
      }),
      r.table('ad').insert({
        id: '222209',
        meta: {
          archived: false,
        },
        company: {
          id: '1009',
          archived: false,
        },
        categories: [
          {
            id: '1129',
            archived: false,
          },
        ],
      }),
      r.table('ad').insert({
        id: '333309',
        meta: {
          archived: false,
        },
        company: {
          id: '2009',
          archived: false,
        },
        categories: [
          {
            id: '1139',
            archived: false,
          },
        ],
      })
    ).run(connection)
  ))
  .then(() => {
    console.log('All done');
    process.exit();
  })
  .catch(err => {
    console.log(err);
  });