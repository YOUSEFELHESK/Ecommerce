import { ErrorCode, httpEXceptions } from "./root";

export class UnauthorizedException extends httpEXceptions {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 401, null);
  }
}
