import { create } from 'redink';
import { USER } from '../../../../constants/entities';

/**
 * Function to create user in the database using the user object.
 *
 * @param {Object} body - User body object.
 * @return {Function}
 */
export default (body) => {
  const record = body;
  const { email } = record;

  const setStripeAttribute = (customer) => {
    record.stripe = customer.id;
    return record;
  };

  const createUser = (newRecord) => create(USER, newRecord);

  const createUserError = err => Promise.reject(err);

  return stripe.customers
    .create({ email })
    .then(setStripeAttribute)
    .then(createUser)
    .catch(createUserError);
};
