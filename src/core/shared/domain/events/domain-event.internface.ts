import { ValueObject } from '../value-object';

export interface IDomainEvent {
  aggregate_id: ValueObject;
  occurred_on: Date;
  event_version: number;

  getIntegrationEvent?(): IIntegrationEvent;
}

export interface IIntegrationEvent<T = any> {
  aggregate_id: ValueObject;
  occurred_on: Date;

  payload: T;
  event_version: number;
}
