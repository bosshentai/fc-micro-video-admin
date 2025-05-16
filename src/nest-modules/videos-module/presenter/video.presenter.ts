import { VideoOutput } from '@core/video/application/use-cases/common/video-output';
import { RatingValues } from '@core/video/domain/value-object/rating.vo';
import { CollectionPresenter } from 'src/nest-modules/shared-module/collection.presenter';
import { VideoCategoryPresenter } from './video-category.presenter';
import { VideoGenrePresenter } from './video-genre.presenter';
import { VideoCastMemberPresenter } from './video-cast.member.presenter';
import { Transform } from 'class-transformer';

export class VideoPresenter {
  id: string;
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: RatingValues;
  is_opened: boolean;
  is_published: boolean;
  categories_id: string[];
  categories: VideoCategoryPresenter[];
  genres_id: string[];
  genres: VideoGenrePresenter[];
  cast_members_id: string[];
  cast_members: VideoCastMemberPresenter[];

  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: VideoOutput) {
    this.id = output.id;
    this.title = output.title;
    this.description = output.description;
    this.year_launched = output.year_launched;
    this.duration = output.duration;
    this.rating = output.rating;
    this.is_opened = output.is_opened;
    this.is_published = output.is_published;
    this.categories_id = output.categories_id;
    this.categories = output.categories.map((item) => {
      return new VideoCategoryPresenter(item);
    });
    this.genres_id = output.genres_id;
    this.genres = output.genres.map((item) => {
      return new VideoGenrePresenter(item);
    });
    this.cast_members_id = output.cast_members_id;
    this.cast_members = output.cast_members.map((item) => {
      return new VideoCastMemberPresenter(item);
    });
    this.created_at = output.created_at;
  }
}

// TODO: finish the collection Presenter
export class VideoCollectionPresenter extends CollectionPresenter<VideoPresenter> {
  data: VideoPresenter[];
}
