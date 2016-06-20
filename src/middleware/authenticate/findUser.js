/**
 * Function to find user in the database based on filter object.
 *
 * @param {Object} filter - RethinkDB filter object (for user).
 * @return {Function}
 */
export default (filter, database) => (
  new Promise((resolve, reject) => {
    database().find(process.env.AUTHENTICATE_TABLE, filter).then(user => (
      user[0].id ? resolve(user[0]) : reject('reject')
    ));
  })
);