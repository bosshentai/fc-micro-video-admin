import { Thumbnail } from './value-object/thumbnail.vo';
import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { CategoryId } from '@core/category/domain/category.aggregate';
import { GenreId } from '@core/genre/domain/genre.aggregate';
import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { ValueObject } from '@core/shared/domain/value-object';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { Rating } from './value-object/rating.vo';
import { Banner } from './value-object/banner.vo';
import { ThumbnailHalf } from './value-object/thumbnail-half.vo';
import { Trailer } from './value-object/trailer.vo';
import { VideoMedia } from './value-object/video-media.vo';
import { VideoValidator } from './video.validator';
import { AudioVideoMediaStatus } from '@core/shared/domain/value-objects/audio-video-media.vo';
import { VideoCreatedEvent } from './domain-events/video-created.event';
import { VideoAudioMediaReplaced } from './domain-events/video-audio.media-replaced.event';
import { VideoFakeBuilder } from './video-fake.builder';

export type VideoConstructorProps = {
  video_id?: VideoId;
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: Rating;
  is_opened: boolean;
  is_published: boolean;

  banner?: Banner | null;
  thumbnail?: Thumbnail | null;
  thumbnail_half?: ThumbnailHalf | null;
  trailer?: Trailer | null;
  video?: VideoMedia | null;

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

  banner?: Banner;

  thumbnail?: Thumbnail;
  thumbnail_half?: ThumbnailHalf;
  trailer?: Trailer;
  video?: VideoMedia;

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

  banner: Banner | null;

  thumbnail: Thumbnail | null;
  thumbnail_half: ThumbnailHalf | null;

  trailer: Trailer | null;
  video: VideoMedia | null;

  categories_id: Map<string, CategoryId>;
  genres_id: Map<string, GenreId>;
  cast_members_id: Map<string, CastMemberId>;
  created_at: Date;

  constructor(props: VideoConstructorProps) {
    super();
    this.video_id = props.video_id ?? new VideoId();
    this.title = props.title;
    this.description = props.description;
    this.year_launched = props.year_launched;
    this.duration = props.duration;

    this.rating = props.rating;

    this.is_opened = props.is_opened;
    this.is_published = props.is_published;

    this.banner = props.banner ?? null;

    this.thumbnail = props.thumbnail ?? null;
    this.thumbnail_half = props.thumbnail_half ?? null;
    this.trailer = props.trailer ?? null;
    this.video = props.video ?? null;

    this.categories_id = props.categories_id;
    this.genres_id = props.genres_id;
    this.cast_members_id = props.cast_members_id;
    this.created_at = props.created_at ?? new Date();

    this.registerHandler(
      VideoCreatedEvent.name,
      this.onVideoCreated.bind(this),
    );
    this.registerHandler(
      VideoAudioMediaReplaced.name,
      this.onVideoAudioMediaReplaced.bind(this),
    );
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

    video.validate(['title']);
    video.applyEvent(
      new VideoCreatedEvent({
        video_id: video.video_id,
        title: video.title,
        description: video.description,
        year_launched: video.year_launched,
        duration: video.duration,
        rating: video.rating,
        is_opened: video.is_opened,
        is_published: video.is_published,
        banner: video.banner,
        thumbnail: video.thumbnail,
        thumbnail_half: video.thumbnail_half,
        trailer: video.trailer,
        video: video.video,
        categories_id: Array.from(video.categories_id.values()),
        genres_id: Array.from(video.genres_id.values()),
        cast_members_id: Array.from(video.cast_members_id.values()),
        created_at: video.created_at,
      }),
    );

    return video;
  }

  changeTitle(title: string): void {
    this.title = title;
    this.validate(['title']);
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

  replaceBanner(banner: Banner): void {
    this.banner = banner;
  }

  replaceThumbnail(thumbnail: Thumbnail): void {
    this.thumbnail = thumbnail;
  }

  replaceThumbnailHalf(thumbnail_half: ThumbnailHalf): void {
    this.thumbnail_half = thumbnail_half;
  }

  replaceTrailer(trailer: Trailer): void {
    this.trailer = trailer;
    this.applyEvent(
      new VideoAudioMediaReplaced({
        aggregate_id: this.video_id,
        media: trailer,
        media_type: 'trailer',
      }),
    );
  }

  replaceVideo(video: VideoMedia): void {
    this.video = video;
    this.applyEvent(
      new VideoAudioMediaReplaced({
        aggregate_id: this.video_id,
        media: video,
        media_type: 'video',
      }),
    );
  }

  addCategoryId(category_id: CategoryId): void {
    this.categories_id.set(category_id.id, category_id);
  }

  removeCategoryId(category_id: CategoryId): void {
    this.categories_id.delete(category_id.id);
  }

  syncCategoriesId(categories_id: CategoryId[]) {
    if (!categories_id.length) {
      throw new Error('Categories id is empty');
    }

    this.categories_id = new Map(
      categories_id.map((category_id) => [category_id.id, category_id]),
    );
  }

  addGenreId(genre_id: GenreId): void {
    this.genres_id.set(genre_id.id, genre_id);
  }

  removeGenreId(genre_id: GenreId): void {
    this.genres_id.delete(genre_id.id);
  }

  syncGenresId(genres_id: GenreId[]) {
    if (!genres_id.length) {
      throw new Error('Genres id is empty');
    }

    this.genres_id = new Map(
      genres_id.map((genre_id) => [genre_id.id, genre_id]),
    );
  }

  addCastMemberId(cast_member_id: CastMemberId): void {
    this.cast_members_id.set(cast_member_id.id, cast_member_id);
  }

  removeCastMemberId(cast_member_id: CastMemberId): void {
    this.cast_members_id.delete(cast_member_id.id);
  }

  syncCastMembersId(cast_members_id: CastMemberId[]) {
    if (!cast_members_id.length) {
      throw new Error('Cast members id is empty');
    }
    this.cast_members_id = new Map(
      cast_members_id.map((cast_member_id) => [
        cast_member_id.id,
        cast_member_id,
      ]),
    );
  }

  onVideoCreated(_event: VideoCreatedEvent) {
    if (this.is_published) {
      return;
    }

    this.tryMarkAsPublished();
  }

  onVideoAudioMediaReplaced(_event: VideoAudioMediaReplaced) {
    if (this.is_published) {
      return;
    }
    this.tryMarkAsPublished();
  }

  private tryMarkAsPublished() {
    if (
      this.trailer &&
      this.video &&
      this.trailer.status === AudioVideoMediaStatus.COMPLETED &&
      this.video.status === AudioVideoMediaStatus.COMPLETED
    ) {
      this.is_published = true;
    }
  }

  validate(fields?: string[]) {
    const validator = new VideoValidator();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return VideoFakeBuilder;
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
      rating: this.rating.value,
      is_opened: this.is_opened,
      is_published: this.is_published,
      banner: this.banner ? this.banner.toJSON() : null,
      thumbnail: this.thumbnail ? this.thumbnail.toJSON() : null,
      thumbnail_half: this.thumbnail_half ? this.thumbnail_half.toJSON() : null,
      trailer: this.trailer ? this.trailer.toJSON() : null,
      video: this.video ? this.video.toJSON() : null,
      categories_id: Array.from(this.categories_id.values()).map((id) => id.id),
      genres_id: Array.from(this.genres_id.values()).map((id) => id.id),
      cast_members_id: Array.from(this.cast_members_id.values()).map(
        (id) => id.id,
      ),
      created_at: this.created_at,
    };
  }
}
