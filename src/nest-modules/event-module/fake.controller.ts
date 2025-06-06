import { Controller, Get } from '@nestjs/common';
import { FakeService } from './fake.service';
import EventEmitter2 from 'eventemitter2';

@Controller('fake-event')
export class FakeController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Get()
  dispatchEvent() {
    this.eventEmitter.emit('test', { data: 'dados dos eventos' });
    return { message: 'Event ok' };
  }
}
