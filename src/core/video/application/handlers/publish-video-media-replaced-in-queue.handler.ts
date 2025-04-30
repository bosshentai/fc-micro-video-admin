import { IDomainEventHandler } from '@core/shared/application/domain-event-handler.interface';
import { VideoAudioMediaReplaced } from '@core/video/domain/domain-events/video-audio.media-replaced.event';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export class PublishVideoMediaReplacedInQueueHandler
  implements IDomainEventHandler
{
  private readonly logger = new Logger(
    PublishVideoMediaReplacedInQueueHandler.name,
    {
      timestamp: true,
    },
  );

  constructor() {
    this.logger.log(PublishVideoMediaReplacedInQueueHandler.name);
  }

  @OnEvent(VideoAudioMediaReplaced.name)
  async handle(event: VideoAudioMediaReplaced): Promise<void> {
    console.log(event);
  }
}
