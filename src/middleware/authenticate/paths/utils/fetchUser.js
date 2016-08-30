import { fetch } from 'redink';

/**
 * Function to find user in the database based on filter object.
 *
 * @param {Object} filter - RethinkDB filter object (for user).
 * @return {Function}
 */
export default ({ id, type }) => {
  const fetchUserError = err => Promise.reject(err);
  const handleUser = user => Promise.resolve(user);

  return fetch(type, id)
    .then(handleUser)
    .catch(fetchUserError);
};
