import { NotFound } from 'http-errors';
import { find } from 'redink';
/**
 * Function to find user in the database based on filter object.
 *
 * @param {Object} filter - RethinkDB filter object (for user).
 * @return {Function}
 */
export default (filter) => (
  new Promise((resolve, reject) => {
    find(process.env.AUTHENTICATE_TABLE, filter)
      .then(user => (
        user[0] ? resolve(user[0]) : reject(new NotFound())
      ));
  })
);
