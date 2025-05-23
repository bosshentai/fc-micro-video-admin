import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Controller, Get } from '@nestjs/common';

@Controller('rabbitmq-fake')
export class RabbitmqController {
  constructor(private amqpConnection: AmqpConnection) {}

  @Get()
  async publishMessage() {
    await this.amqpConnection.publish('amq.direct', 'fake-routing-key', {
      message: 'Hello, RabbitMQ!',
    });
  }
}
