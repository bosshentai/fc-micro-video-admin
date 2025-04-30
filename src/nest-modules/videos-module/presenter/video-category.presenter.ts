import { VideoCategoryOutput } from '@core/video/application/use-cases/common/video-output';
import { Transform } from 'class-transformer';

export class VideoCategoryPresenter {
  id: string;

  name: string;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: VideoCategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.created_at = output.created_at;
  }
}
