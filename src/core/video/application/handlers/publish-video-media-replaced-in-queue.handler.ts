import { IIntegrationEventHandler } from '@core/shared/application/domain-event-handler.interface';
import { IMessageBroker } from '@core/shared/application/message-broker.interface';
import { VideoAudioMediaUploadedIntegrationEvent } from '@core/video/domain/domain-events/video-audio.media-replaced.event';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export class PublishVideoMediaReplacedInQueueHandler
  implements IIntegrationEventHandler
{
  private readonly logger = new Logger(
    PublishVideoMediaReplacedInQueueHandler.name,
    {
      timestamp: true,
    },
  );

  constructor(private messageBroker: IMessageBroker) {
    this.logger.log(PublishVideoMediaReplacedInQueueHandler.name);
  }

  @OnEvent(VideoAudioMediaUploadedIntegrationEvent.name)
  async handle(event: VideoAudioMediaUploadedIntegrationEvent): Promise<void> {
    await this.messageBroker.publishEvent(event);
  }
}
