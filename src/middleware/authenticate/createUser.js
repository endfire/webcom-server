import { BadRequest } from 'http-errors';
/**
 * Function to create user in the database using the user object.
 *
 * @param {Object} body - User body object.
 * @return {Function}
 */
export default (body, database) => (
  new Promise((resolve, reject) => {
    database().create(process.env.AUTHENTICATE_TABLE, body).then(user => (
      user.id ? resolve(user.id) : reject(new BadRequest())
    ));
  })
);
