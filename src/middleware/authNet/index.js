import { stripeError, authNet } from '../utils';
import { SUBMISSION } from '../../constants/entities';
import email from 'emailjs/email';
import { forEach } from 'lodash';

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
                ${body.payment.firstName} ${body.payment.lastName},
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
                Thanks,<br /><br />
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
