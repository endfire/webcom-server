import { stripeError, authNet } from '../utils';
import { SUBMISSION } from '../../constants/entities';
import { forEach } from 'lodash';
import sendEmails from './emails';

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
      if (!body.hasOwnProperty('items')) {
        return sendEmails('N/A', body)
          .then(next);
      }

      if (!body.payment.cardNumber) stripeError('Missing credit card number.');
      if (!body.payment.expMonth) stripeError('Missing credit card expiration month.');
      if (!body.payment.expYear) stripeError('Missing credit card expiration year.');
      if (!body.payment.cardCvc) stripeError('Missing credit card cvc.');
      if (!body.payment.firstName) stripeError('Missing payment first name.');
      if (!body.payment.lastName) stripeError('Missing payment last name.');
      if (!body.payment.email) stripeError('Missing payment email.');
      if (!body.items) stripeError('Missing payment items.');
      if (!body.name) stripeError('Missing form name.');

      let amount;
      amount = 0;

      forEach(body.items, item => {
        amount += (Number(item.quantity) * Number(item.price));
      });

      if (amount <= 0) stripeError('Please purchase at least one item.');

      const charge = {
        number: body.payment.cardNumber,
        exp: `${body.payment.expMonth}${body.payment.expYear}`,
        code: body.payment.cardCvc,
        amount,
        firstName: body.payment.firstName,
        lastName: body.payment.lastName,
        email: body.payment.email,
        description: body.name,
        company: body.payment.company,
        address: body.payment.address,
        city: body.payment.city,
        state: body.payment.state,
        zip: body.payment.zip,
        country: body.payment.country,
        phone: body.payment.phone,
      };

      const handleSuccess = (res) => {
        if (res.messages.resultCode === 'Error') {
          console.log(res.messages);
          stripeError('There was a problem processing your transaction.');
        }

        body.transactionID = res.transactionResponse.transId;

        delete body.payment.cardNumber;
        delete body.payment.expMonth;
        delete body.payment.expYear;
        delete body.payment.cardCvc;

        return body.transactionID;
      };

      const handleEmail = (transactionID) => sendEmails(transactionID, body);

      return authNet(charge)
        .then(handleSuccess)
        .then(handleEmail)
        .then(next)
        .catch(handleAuthNetError);
    }

    default:
      return next();
  }
};
