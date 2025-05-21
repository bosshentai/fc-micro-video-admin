import { VideoGenreOutput } from '@core/video/application/use-cases/common/video-output';
import { Transform, Type } from 'class-transformer';
import { VideoCategoryPresenter } from './video-category.presenter';

export class VideoGenrePresenter {
  id: string;
  name: string;

  is_active: boolean;

  categories_id: string[];

  @Type(() => VideoCategoryPresenter)
  categories: VideoCategoryPresenter[];

  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: VideoGenreOutput) {
    this.id = output.id;
    this.name = output.name;
    this.is_active = output.is_active;
    this.categories_id = output.categories_id;
    this.categories = output.categories.map((item) => {
      return new VideoCategoryPresenter(item);
    });
    this.created_at = output.created_at;
  }
}
