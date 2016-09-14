import { stripeError, invalidMethodError, authNet } from '../utils';
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
        number: body.payment.cardNumber,
        exp: `${body.payment.expMonth}${body.payment.expYear}`,
        code: body.payment.cardCvc,
        amount: body.payment.amount,
      };

      const handleSuccess = (res) => {
        console.log(res);
        body.stripe = res.getTransactionResponse().getTransId();
      };

      return authNet(charge)
        .then(handleSuccess)
        .then(next)
        .catch(handleStripeError);
    }

    default:
      return next();
  }
};
