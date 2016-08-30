import HttpError from 'http-errors';

/**
 * Webcom HTTP Error.
 * Send status and error message back to client.
 *
 * @param {Number} status - Status code to send to client.
 * @param {String} Message - Message describing the error.
 */
export class WebcomHttpError extends HttpError {
  constructor(status, message) {
    super(status, message);
    this.name = 'WebcomHttpError';
  }
}

/**
 * Handle Webcom http errors.
 *
 * @param {String} - Webcom error message
 */
export const invalidRequestError = message => {
  throw new WebcomHttpError(400, {
    type: 'invalid_request_error',
    message,
  });
};

export const algoliaError = message => {
  throw new WebcomHttpError(400, {
    type: 'algolia_error',
    message,
  });
};

export const fetchUserError = message => {
  throw new WebcomHttpError(400, {
    type: 'fetch_user_error',
    message,
  });
};

export const findUserError = message => {
  throw new WebcomHttpError(400, {
    type: 'find_user_error',
    message,
  });
};

export const createUserError = message => {
  throw new WebcomHttpError(400, {
    type: 'create_user_error',
    message,
  });
};

export const stripeError = message => {
  throw new WebcomHttpError(400, {
    type: 'stripe_error',
    message,
  });
};

export const signupError = message => {
  throw new WebcomHttpError(401, {
    type: 'signup_error',
    message,
  });
};

export const loginError = message => {
  throw new WebcomHttpError(401, {
    type: 'login_error',
    message,
  });
};

export const authenticationError = message => {
  throw new WebcomHttpError(401, {
    type: 'authentication_error',
    message,
  });
};

export const authorizationError = message => {
  throw new WebcomHttpError(403, {
    type: 'authorization_error',
    message,
  });
};

export const invalidMethodError = message => {
  throw new WebcomHttpError(405, {
    type: 'invalid_method_error',
    message,
  });
};
