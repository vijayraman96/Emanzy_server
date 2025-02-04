

  const HttpCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    UN_AUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
  };

  const ResponseMessage = {
    emailRequired: 'Email is required.',
    emailAndPassRequired: 'Email and Password is required.',
    passwordDoesNotMatch: "Password does not match",
    passwordDoesNotExist: 'The password is empty',
    errroSendingMail: 'Failed to send an Email',
    userNotFound: 'User not found.',
    invalidPassword: 'Invalid password.',
    internalError: 'An error occurred while processing your request.',
    userExist: "User already exist",
    userNotExist: "User not exist"
  };

  export { HttpCode, ResponseMessage }