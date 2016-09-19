import { stripeError } from '../utils';
import { SUBMISSION } from '../../constants/entities';
import authNet from 'simple-authorizenet';

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
    return next();
  }

  const handleAuthNetError = err => {
    stripeError(err.message);
  };

  switch (table) {
    case SUBMISSION: {
      // TODO: Check payment info or next()

      if (!body.hasOwnProperty('items')) return next();

      if (!body.payment.cardNumber) stripeError('Missing credit card number.');
      if (!body.payment.expMonth) stripeError('Missing credit card expiration month.');
      if (!body.payment.expYear) stripeError('Missing credit card expiration year.');
      if (!body.payment.cardCvc) stripeError('Missing credit card cvc.');
      if (!body.payment.amount) stripeError('Missing amount.');
      if (!body.payment.firstName) stripeError('Missing payment first name.');
      if (!body.payment.lastName) stripeError('Missing payment last name.');
      if (!body.payment.email) stripeError('Missing payment email.');
      if (!body.name) stripeError('Missing form name.');

      const charge = {
        number: body.payment.cardNumber,
        exp: `${body.payment.expMonth}${body.payment.expYear}`,
        code: body.payment.cardCvc,
        amount: body.payment.amount,
        firstName: body.payment.firstName,
        lastName: body.payment.lastName,
        email: body.payment.email,
        description: body.name,
      };

      const handleSuccess = (res) => {
        if (res.messages.resultCode === 'Error') {
          stripeError('There was a problem processing your transaction.');
        }
        body.transactionID = res.transactionResponse.transId;
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
