import { IDomainEvent } from './../domain/events/domain-event.internface';

export interface IDomainEventHandler {
  handle(event: IDomainEvent): Promise<void>;
}
