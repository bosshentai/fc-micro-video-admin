import { Injectable, Logger, UseFilters, ValidationPipe } from '@nestjs/common';
import { ProcessAudioVideoMediasUseCase } from '@core/video/application/use-cases/process-audio-video-medias/process-audio-video-medias.use-case';
import { AudioVideoMediaStatus } from '@core/shared/domain/value-objects/audio-video-media.vo';
import { ProcessAudioVideoMediasInput } from '@core/video/application/use-cases/process-audio-video-medias/process-audio-video-medias.input';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ModuleRef } from '@nestjs/core';
import { RabbitmqConsumeErrorFilter } from '../rabbitmq-module/rabbitmq-consume-error/rabbitmq-consume-error.filter';

// scope - request

@UseFilters(RabbitmqConsumeErrorFilter)
@Injectable()
export class VideosConsumers {
  private readonly logger = new Logger(VideosConsumers.name, {
    timestamp: true,
  });

  constructor(private moduleRef: ModuleRef) {
    this.logger.log(VideosConsumers.name);
  }

  @RabbitSubscribe({
    exchange: 'direct.delayed',
    routingKey: 'videos.convert',
    queue: 'micro-videos/admin',
    allowNonJsonMessages: true,
    queueOptions: {
      deadLetterExchange: 'dlx.exchange',
      deadLetterRoutingKey: 'videos.convert',
      // messageTtl: 30000, // 30 seconds tempo de vida da messsagem na fila para ser republicada
    },
  })
  async onProcessVideo(msg: {
    video: {
      resource_id: string;
      encoded_video_folder: string;
      status: 'COMPLETED' | 'FAILED';
    };
  }) {
    const resource_id = `${msg.video?.resource_id}`;
    const [video_id, field] = resource_id.split('.');
    const input = new ProcessAudioVideoMediasInput({
      video_id,
      field: field as 'trailer' | 'video',
      encoded_location: msg.video?.encoded_video_folder,
      status: msg.video?.status as AudioVideoMediaStatus,
    });

    await new ValidationPipe({
      errorHttpStatusCode: 422,
    }).transform(input, {
      metatype: ProcessAudioVideoMediasInput,
      type: 'body',
    });

    const useCase = await this.moduleRef.resolve(
      ProcessAudioVideoMediasUseCase,
    );
    await useCase.execute(input);
  }
}
