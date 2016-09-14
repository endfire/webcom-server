import { APIContracts, APIControllers } from 'authorizenet';

const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
const creditCard = new APIContracts.CreditCardType();
const paymentType = new APIContracts.PaymentType();
const transactionRequestType = new APIContracts.TransactionRequestType();
const createRequest = new APIContracts.CreateTransactionRequest();

export default ({ number, exp, code, amount }) => {
  merchantAuthenticationType.setName(process.env.AUTH_NET_API);
  merchantAuthenticationType.setTransactionKey(process.env.AUTH_NET_KEY);

  creditCard.setCardNumber(number);
  creditCard.setExpirationDate(exp);
  creditCard.setCardCode(code);

  paymentType.setCreditCard(creditCard);

  transactionRequestType.setTransactionType(
    APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(amount);

  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

    // pretty print request
  console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  const ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());

  return new Promise((resolve) => {
    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      const response = new APIContracts.CreateTransactionResponse(apiResponse);

      // pretty print response
      console.log(JSON.stringify(response, null, 2));

      if (response != null) {
        if (
          response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK &&
          response.getTransactionResponse().getResponseCode() === '1'
        ) {
          console.log('Transaction ID: ', response.getTransactionResponse().getTransId());
        } else {
          console.log('Result Code: ', response.getMessages().getResultCode());
          console.log('Error Code: ', response.getMessages().getMessage()[0].getCode());
          console.log('Error message: ', response.getMessages().getMessage()[0].getText());
        }
      } else {
        console.log('Null Response.');
      }

      return resolve(response);
    });
  });
};
