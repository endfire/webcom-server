import { stripeError } from '../utils';
import { SUBMISSION } from '../../constants/entities';
import authNet from 'simple-authorizenet';
import email from 'emailjs/email';

const server = email.server.connect({
  user: 'infowebcomcommunications@gmail.com',
  password: process.env.EMAIL_PASSWORD,
  host: 'smtp.gmail.com',
  tls: { ciphers: 'SSLv3' },
});

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
        return body.transactionID;
      };

      const sendEmails = (transactionID) => {
        const message	= {
          text:	'Thank you for your payment!',
          from:	'Webcom Communications <infowebcomcommunications@gmail.com>',
          to:	`${body.payment.firstName} ${body.payment.lastName} <${body.payment.email}>`,
          cc: `Recipient One <${body.recipientOne}>,
               Recipient Two <${body.recipientTwo}>,
               Recipient Three <${body.recipientThree}>`,
          subject: `Receipt for ${body.name}`,
          attachment: [{
            data: `<html>
              <p>
                ${body.payment.firstName} ${body.payment.firstName},
              </p>
              <p>
                Thank you for your payment from ${body.name}.
                Your transaction ID is ${transactionID}.
              </p>
              <p>
                If you have any questions about your purchase,
                please contact Webcom Communications at (720) 528-3770.
              </p>
              <p>
                Thanks,<br />
                Webcom Communications<br />
                7355 E Orchard Rd<br />
                Greenwood Village, CO 80111
              </p>
            </html>`,
            alternative: true,
          }],
        };

        return new Promise((resolve) => {
          server.send(message, (err, mesRes) => {
            resolve(err || mesRes);
          });
        });
      };

      return authNet(charge)
        .then(handleSuccess)
        .then(sendEmails)
        .then(next)
        .catch(handleAuthNetError);
    }

    default:
      return next();
  }
};
