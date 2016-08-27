import { find } from 'redink';
import { USER } from '../../../../constants/entities';

/**
 * Function to find user in the database based on filter object.
 *
 * @param {Object} filter - RethinkDB filter object (for user).
 * @return {Function}
 */
export default (filter) => {
  const findUserError = err => Promise.reject(err);

  const handleUser = user => {
    if (user[0]) return Promise.resolve(user[0]);

    return findUserError({
      message: 'Could not find the user',
    });
  };

  return find(USER, filter)
    .then(handleUser)
    .catch(findUserError);
};
