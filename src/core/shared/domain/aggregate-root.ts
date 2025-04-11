import { Entity } from './entity';
import { IDomainEvent } from './events/domain-event.internface';
import EventEmitter2 from 'eventemitter2';

export abstract class AggregateRoot extends Entity {
  events: Set<IDomainEvent> = new Set<IDomainEvent>();
  localMediator = new EventEmitter2();

  // going to be used inside the aggregate
  applyEvent(event: IDomainEvent) {
    this.events.add(event);
    this.localMediator.emit(event.constructor.name, event);
  }

  registerHandler(event: string, handler: (event: IDomainEvent) => void) {
    this.localMediator.on(event, handler);
  }
}
