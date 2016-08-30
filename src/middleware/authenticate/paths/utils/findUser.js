import { find } from 'redink';

/**
 * Function to find user in the database based on filter object.
 *
 * @param {Object} filter - RethinkDB filter object (for user).
 * @return {Function}
 */
export default ({ filter, type }) => {
  const findUserError = err => Promise.reject(err);

  const handleUser = user => {
    if (user[0]) return Promise.resolve(user[0]);

    return findUserError({
      message: 'Could not find the user',
    });
  };

  return find(type, filter)
    .then(handleUser)
    .catch(findUserError);
};
