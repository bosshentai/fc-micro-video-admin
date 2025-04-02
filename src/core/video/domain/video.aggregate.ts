import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { CategoryId } from '@core/category/domain/category.aggregate';
import { GenreId } from '@core/genre/domain/genre.aggregate';
import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { ValueObject } from '@core/shared/domain/value-object';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { any } from 'joi';
import { Rating } from './value-object/rating.vo';

export type VideoConstructorProps = {
  vide_id?: VideoId;
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: Rating;
  is_opened: boolean;
  is_published: boolean;

  categories_id: Map<string, CategoryId>;
  genres_id: Map<string, GenreId>;
  cast_members_id: Map<string, CastMemberId>;
  created_at?: Date;
};

export type VideoCreateCommand = {
  title: string;
  description: string;
  year_launched: number;
  duration: number;

  rating: Rating;

  is_opened: boolean;

  categories_id: CategoryId[];
  genres_id: GenreId[];
  cast_members_id: CastMemberId[];
};

export class VideoId extends Uuid {}

export class Video extends AggregateRoot {
  video_id: VideoId;
  title: string;
  description: string;
  year_launched: number;
  duration: number;

  rating: Rating;

  is_opened: boolean;
  is_published: boolean;

  categories_id: Map<string, CategoryId>;
  genres_id: Map<string, GenreId>;
  cast_members_id: Map<string, VideoId>;
  created_at: Date;

  constructor(props: VideoConstructorProps) {
    super();
    this.video_id = props.vide_id ?? new VideoId();
    this.title = props.title;
    this.description = props.description;
    this.year_launched = props.year_launched;
    this.duration = props.duration;

    this.rating = props.rating;

    this.is_opened = props.is_opened;
    this.is_published = props.is_published;

    this.categories_id = props.categories_id;
    this.genres_id = props.genres_id;
    this.cast_members_id = props.cast_members_id;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: VideoCreateCommand): Video {
    const video = new Video({
      ...props,
      categories_id: new Map(
        props.categories_id.map((category_id) => [category_id.id, category_id]),
      ),
      genres_id: new Map(
        props.genres_id.map((genre_id) => [genre_id.id, genre_id]),
      ),
      cast_members_id: new Map(
        props.cast_members_id.map((cast_member_id) => [
          cast_member_id.id,
          cast_member_id,
        ]),
      ),
      is_published: false,
    });

    video.validate;

    return video;

    // return new Video(props);
  }

  changeTitle(title: string): void {
    this.title = title;
    this.validate;
  }

  changeDescription(description: string): void {
    this.description = description;
  }

  changeYearLaunched(year_launched: number): void {
    this.year_launched = year_launched;
  }

  changeDuration(duration: number): void {
    this.duration = duration;
  }

  changeRating(rating: Rating): void {
    this.rating = rating;
  }

  markAsOpened(): void {
    this.is_opened = true;
  }

  markAsNotOpened(): void {
    this.is_opened = false;
  }

  get entity_id(): ValueObject {
    return this.video_id;
  }
  toJSON() {
    return {
      video_id: this.video_id.id,
      title: this.title,
      description: this.description,
      year_launched: this.year_launched,
      duration: this.duration,
      is_opened: this.is_opened,
      is_published: this.is_published,
      categories_id: Array.from(this.categories_id.values()).map((id) => id.id),
      genres_id: Array.from(this.genres_id.values()).map((id) => id.id),
      cast_members_id: Array.from(this.cast_members_id.values()).map(
        (id) => id.id,
      ),
      created_at: this.created_at,
    };
  }
}
