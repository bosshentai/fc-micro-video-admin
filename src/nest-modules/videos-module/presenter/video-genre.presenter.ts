import { VideoGenreOutput } from '@core/video/application/use-cases/common/video-output';
import { Transform } from 'class-transformer';

export class VideoGenrePresenter {
  id: string;
  name: string;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: VideoGenreOutput) {
    this.id = output.id;
    this.name = output.name;
    this.created_at = output.created_at;
  }
}
