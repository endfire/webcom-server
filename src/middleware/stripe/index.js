import { stripeError, invalidMethodError, stripe } from '../utils';
import { SUBMISSION } from '../../constants/entities';

/**
 * Checks to see if incoming requests require Stripe.
 *
 * @param {Object} ctx
 * @param {Function} next
 * @return {Function}
 */
export default (ctx, next) => {
  const { params, request: { method, body } } = ctx;
  const { table } = params;

  if (method !== 'POST') {
    invalidMethodError(`Invalid method expecting POST but got '${method}'`);
  }

  const handleStripeError = err => {
    stripeError(err.message);
  };

  switch (table) {
    case SUBMISSION: {
      const charge = {
        amount: body.amount,
        source: {
          exp_month: body.expMonth,
          exp_year: body.expYear,
          number: body.cardNumber,
          cvc: body.cardCvc,
          object: 'card',
        },
        receipt_email: body.email,
        description: body.description,
        currency: 'usd',
      };

      const handleSuccess = (res) => {
        body.stripe = res.id;
      };

      return stripe.charges
        .create(charge)
        .then(handleSuccess)
        .then(next)
        .catch(handleStripeError);
    }

    default:
      return next();
  }
};
