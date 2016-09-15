import rp from 'request-promise';

export default ({ number, exp, code, amount, email, firstName, lastName }) => {
  const createRequest = {
    createTransactionRequest: {
      merchantAuthentication: {
        name: process.env.AUTH_NET_API,
        transactionKey: process.env.AUTH_NET_KEY,
      },
      clientId: null,
      transactionRequest: {
        transactionType: 'authCaptureTransaction',
        amount,
        payment: {
          creditCard: {
            cardNumber: number,
            expirationDate: exp,
            cardCode: code,
          },
        },
        customer: {
          email,
        },
        billTo: {
          firstName,
          lastName,
        },
      },
    },
  };

  const options = {
    method: 'POST',
    uri: process.env.AUTH_NET_URL,
    body: createRequest,
    json: true,
  };

  return rp(options)
    .then(response => JSON.parse(response.substring(1, response.length)))
    .catch(err => Promise.reject(err));
};
