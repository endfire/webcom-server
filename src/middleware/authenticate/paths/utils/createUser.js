import { create } from 'redink';

/**
 * Function to create user in the database using the user object.
 *
 * @param {Object} body - User body object.
 * @return {Function}
 */
export default ({ body, type }) => {
  const record = body;

  const createUserError = err => Promise.reject(err);

  return create(type, record)
    .catch(createUserError);
};
