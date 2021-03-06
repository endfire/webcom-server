import email from 'emailjs/email';
import { forEach } from 'lodash';

const server = email.server.connect({
  user: 'infowebcomcommunications@gmail.com',
  password: process.env.EMAIL_PASSWORD,
  host: 'smtp.gmail.com',
  tls: { ciphers: 'SSLv3' },
});

export default (transactionID, info) => {
  const { payment, items, fields } = info;
  const itemArray = [];
  const fieldArray = [];
  let message;
  let html;
  let fieldEmail = undefined;

  forEach(items || [], (item) => {
    if (item.quantity > 0) {
      itemArray.push(
        `${item.quantity} - ${item.label} for the price of $${item.price * item.quantity}<br />`
      );
    }
  });

  const sortedFields = [];

  if (fields) {
    forEach(fields || [], (field) => {
      sortedFields.push(field);
    });

    if (sortedFields.length > 0) {
      sortedFields.sort((a, b) => {
        if (a.priority > b.priority) {
          return 1;
        }
        if (a.priority < b.priority) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    }
  }

  forEach(sortedFields || [], (field) => {
    fieldArray.push(`${field.label}: ${field.value}<br />`);

    if (field.label === 'email' || field.label === 'Email') fieldEmail = field.value;
  });

  // Payment Receipt
  if (items) {
    message	= {
      text:	'Thank you for your purchase.',
      from:	'Webcom Communications <infowebcomcommunications@gmail.com>',
      to:	`${payment.firstName} ${payment.lastName} <${payment.email}>`,
      cc: `Recipient One <${info.recipientOne}>,
           Recipient Two <${info.recipientTwo}>,
           Recipient Three <${info.recipientThree}>`,
      subject: `Receipt for ${info.name} :: ${transactionID}`,
      attachment: [],
    };

    const transactionIDMessage = transactionID === 'Bill me later'
      ? 'You selected the \'Bill me Later\' option.'
      : `Your transaction ID is '${transactionID}'.`;

    html = `<html>
      <p>
        ${payment.firstName} ${payment.lastName},
      </p>
      <p>
        Thank you for your payment.
        ${transactionIDMessage}
      </p>
      <p>
        If you have any questions about your purchase,
        please contact Webcom Communications at (720) 528-3770.
      </p>
      <p>
        <strong>Items:</strong><br />
        ${itemArray.join('')}
      </p>
      <p>
        <strong>Information:</strong><br />
        firstName: ${payment.firstName}<br />
        lastName: ${payment.lastName}<br />
        email: ${payment.email}<br />
        company: ${payment.company}<br />
        address: ${payment.address}<br />
        city: ${payment.city}<br />
        state: ${payment.state}<br />
        zip: ${payment.zip}<br />
        country: ${payment.country}<br />
        phone: ${payment.phone}<br />
        ${fieldArray.join('')}
      </p>
      <p>
        Thanks,<br /><br />
        Webcom Communications<br />
        7355 E Orchard Rd<br />
        Greenwood Village, CO 80111
      </p>
    </html>`;

    message.attachment.push({
      data: html,
      alternative: true,
    });
  } else {
    // Non-payment Receipt
    const toRecipient = fieldEmail
      ? `Webcom Customer <${fieldEmail}>`
      : 'Webcom Communications <infowebcomcommunications@gmail.com>';

    message	= {
      text:	'Thank you for your submission.',
      from:	'Webcom Communications <infowebcomcommunications@gmail.com>',
      to:	toRecipient,
      cc: `Recipient One <${info.recipientOne}>,
           Recipient Two <${info.recipientTwo}>,
           Recipient Three <${info.recipientThree}>`,
      subject: `Receipt for ${info.name}`,
      attachment: [],
    };

    html = `<html>
      <p>
        To whom it may concern,
      </p>
      <p>
        Thank you for your submission of ${info.name}.
      </p>
      <p>
        If you have any questions about your submission,
        please contact Webcom Communications at (720) 528-3770.
      </p>
      <p>
        <strong>Information:</strong><br />
        ${fieldArray.join('')}
      </p>
      <p>
        Thanks,<br /><br />
        Webcom Communications<br />
        7355 E Orchard Rd<br />
        Greenwood Village, CO 80111
      </p>
    </html>`;
  }

  message.attachment.push({
    data: html,
    alternative: true,
  });

  return new Promise((resolve) => {
    server.send(message, (err, mesRes) => {
      resolve(err || mesRes);
    });
  });
};
