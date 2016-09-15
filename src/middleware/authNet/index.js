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

  const handleAuthNetError = err => {
    stripeError(err.message);
  };

  switch (table) {
    case SUBMISSION: {
      const charge = {
        number: body.payment.cardNumber,
        exp: `${body.payment.expMonth}${body.payment.expYear}`,
        code: body.payment.cardCvc,
        amount: body.payment.amount,
        firstName: body.payment.firstName,
        lastName: body.payment.lastName,
        email: body.payment.email,
      };

      const handleSuccess = (res) => {
        if (res.messages.resultCode === 'Error') {
          stripeError('There was a problem processing your transaction.');
        }
        body.stripe = res.transactionResponse.transId;
      };

      return authNet(charge)
        .then(handleSuccess)
        .then(next)
        .catch(handleAuthNetError);
    }

    default:
      return next();
  }
};
