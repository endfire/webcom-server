import { fetch } from 'redink';
import { USER } from '../../../../constants/entities';

/**
 * Function to find user in the database based on filter object.
 *
 * @param {Object} filter - RethinkDB filter object (for user).
 * @return {Function}
 */
export default (id) => {
  const fetchUserError = err => Promise.reject(err);
  const handleUser = user => Promise.resolve(user);

  return fetch(USER, id)
    .then(handleUser)
    .catch(fetchUserError);
};
