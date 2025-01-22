import { FieldsErrors } from "./shared/domain/validator/validator-fields.interface";
declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (expected: FieldsErrors) => R;
    }
  }
}
