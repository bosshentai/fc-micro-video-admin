import { Notification } from './validator/notification';
import { ValueObject } from './value-object';

export abstract class Entity {
  notification: Notification = new Notification();

  abstract get entity_id(): ValueObject;

  abstract toJSON(): any;
}
