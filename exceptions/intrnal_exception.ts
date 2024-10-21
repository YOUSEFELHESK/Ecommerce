import { httpEXceptions } from "./root";

export class InternalException extends httpEXceptions {
  constructor(message: string, errors: any, errorCode: number) {
    super(message, errorCode, 500, errors);
  }
}
