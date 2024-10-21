import { httpEXceptions } from "./root";

export class UnprocessableEntity extends httpEXceptions {
  constructor(error: any, message: string, errorCode: number) {
    super(message, errorCode, 442, error);
  }
}
