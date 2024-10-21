//message, status code, error code, error

export class httpEXceptions extends Error {
  message: string;
  errorCode: any;
  statusCode: number;
  errors: ErrorCode;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.errors = error;
    this.statusCode = statusCode;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREDY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  UNPROCESSABLE_ENTITY = 2001,
  INTRNAL_ERROR = 3001,
  UNAUTHORIZED = 4001,
}
