import {
  InvalidMediaFileMimeTypeError,
  InvalidMediaFileSizeError,
} from './../../../shared/domain/validator/media-file.validator';
import { MediaFileValidator } from '@core/shared/domain/validator/media-file.validator';
import { ImageMedia } from '@core/shared/domain/value-objects/image-media.vo';
import { VideoId } from '../video.aggregate';
import { Either } from '@core/shared/domain/either';

export class Thumbnail extends ImageMedia {
  static max_size = 1024 * 1024 * 2;
  static mime_types = ['image/jpeg', 'image/png'];

  static createFromFile({
    raw_name,
    mime_type,
    size,
    video_id,
  }: {
    raw_name: string;
    mime_type: string;
    size: number;
    video_id: VideoId;
  }) {
    const mediaFileValidator = new MediaFileValidator(
      Thumbnail.max_size,
      Thumbnail.mime_types,
    );

    return Either.safe<
      Thumbnail,
      InvalidMediaFileSizeError | InvalidMediaFileMimeTypeError
    >(() => {
      const { name } = mediaFileValidator.validate({
        raw_name,
        mime_type,
        size,
      });

      return new Thumbnail({
        name: `${video_id.id}-${name}`,
        location: `videos/${video_id.id}/images`,
      });
    });
  }
}
