import { ErrorCode, httpEXceptions } from "./root";

export class BadRequestException extends httpEXceptions {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 400, null);
  }
}
