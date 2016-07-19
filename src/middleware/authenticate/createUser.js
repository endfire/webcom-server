import { NotFound } from 'http-errors';
import { create } from 'redink';
/**
 * Function to create user in the database using the user object.
 *
 * @param {Object} body - User body object.
 * @return {Function}
 */
export default (body) => (
  new Promise((resolve, reject) => {
    create(process.env.AUTHENTICATE_TABLE, body)
      .then(user => (
        user.id ? resolve(user.id) : reject(new NotFound())
      ));
  })
);
