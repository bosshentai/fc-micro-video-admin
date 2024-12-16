import { FieldsErrors } from "./valiation-fields.interface";

export abstract class BaseValidationError extends Error {
  constructor(public error: FieldsErrors[], message = "Validation Error") {
    super(message);
  }

  count() {
    return Object.keys(this.error).length;
  }
}

export class ValidationError extends Error {}
