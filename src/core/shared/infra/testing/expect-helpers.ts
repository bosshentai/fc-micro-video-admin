import { ValueObject } from '@core/shared/domain/value-object';
import { Notification } from '../../domain/validator/notification';

expect.extend({
  notificationContainsErrorMessages(
    expected: Notification,
    received: Array<string | { [key: string]: string[] }>,
  ) {
    const every = received.every((error) => {
      if (typeof error === 'string') {
        return expected.errors.has(error);
      } else {
        return Object.entries(error).every(([field, messages]) => {
          const fieldMessages = expected.errors.get(field) as string[];

          return (
            fieldMessages &&
            fieldMessages.length &&
            fieldMessages.every((message) => messages.includes(message))
          );
        });
      }
    });
    return every
      ? { pass: true, message: () => '' }
      : {
          pass: false,
          message: () =>
            `The validation errors not contains ${JSON.stringify(
              received,
            )}. Current: ${JSON.stringify(expected.toJSON())}`,
        };
  },
  toBeValueObject(expected: ValueObject, received: ValueObject) {
    return expected.equals(received)
      ? { pass: true, message: () => '' }
      : {
          pass: false,
          message: () =>
            `The value object are not equal. Expected: ${JSON.stringify(expected)} | Received: ${JSON.stringify(
              received,
            )}`,
        };
  },
});

// function assertContainsErrorsMessages(
//   expected: FieldsErrors,
//   received: FieldsErrors
// ) {
//   const isMath = expect.objectContaining(received).asymetricMatch(expected);

//   return isMath
//     ? isValid()
//     : {
//         pass: false,
//         message: () =>
//           `The validation errors not contains ${JSON.stringify(
//             received
//           )}. Current: ${JSON.stringify(expected)}`,
//       };
// }

// function isValid() {
//   return { pass: true, message: () => "" };
// }
