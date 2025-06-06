import { Notification } from './notification';
export type FieldsErrors = { [field: string]: string[] } | string;

export interface IValidatorFields {
  validate(
    notification: Notification,
    data: object,
    fields?: string[],
  ): boolean;
}
