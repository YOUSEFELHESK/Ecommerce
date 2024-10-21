import { ErrorCode, httpEXceptions } from "./root";

export class NotFoundException extends httpEXceptions {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 404, null);
  }
}
