import { IUseCase } from '@core/shared/application/use-case.interface';
import { UploadAudioVideoMediaInput } from './upload-audio-video-media.input';
import { IVideoRepository } from '@core/video/domain/video.repository';
import { IStorage } from '@core/shared/application/storage.interface';
import { Video, VideoId } from '@core/video/domain/video.aggregate';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Trailer } from '@core/video/domain/value-object/trailer.vo';
import { VideoMedia } from '@core/video/domain/value-object/video-media.vo';
import { EntityValidationError } from '@core/shared/domain/validator/validation.error';
import { ApplicationService } from '@core/shared/application/application.service';

export class UploadAudioVideoMediasUseCase
  implements IUseCase<UploadAudioVideoMediaInput, UploadAudioVideoMediaOutput>
{
  constructor(
    private appService: ApplicationService,
    private videoRepo: IVideoRepository,
    private storage: IStorage,
  ) {}

  async execute(
    input: UploadAudioVideoMediaInput,
  ): Promise<UploadAudioVideoMediaOutput> {
    const video = await this.videoRepo.findById(new VideoId(input.video_id));

    if (!video) {
      throw new NotFoundError(input.video_id, Video);
    }

    const audioVideoMediaMap = {
      trailer: Trailer,
      video: VideoMedia,
    };

    const audioMediaClass = audioVideoMediaMap[input.field] as
      | typeof Trailer
      | typeof VideoMedia;

    const [audioVideoMedia, errorAudioMedia] = audioMediaClass
      .createFromFile({
        ...input.file,
        video_id: video.video_id,
      })
      .asArray();

    if (errorAudioMedia) {
      throw new EntityValidationError([
        {
          [input.field]: [errorAudioMedia.message],
        },
      ]);
    }

    audioVideoMedia instanceof Trailer && video.replaceTrailer(audioVideoMedia);

    audioVideoMedia instanceof VideoMedia &&
      video.replaceVideo(audioVideoMedia);

    await this.storage.store({
      data: input.file.data,
      id: audioVideoMedia.raw_location,
      mime_type: input.file.mime_type,
    });

    await this.appService.run(async () => {
      return await this.videoRepo.update(video);
    });
  }
}

export type UploadAudioVideoMediaOutput = void;
