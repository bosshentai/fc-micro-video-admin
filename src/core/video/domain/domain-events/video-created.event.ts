import { GenreId } from '@core/genre/domain/genre.aggregate';
import { Banner } from '../value-object/banner.vo';
import { Rating } from '../value-object/rating.vo';
import { ThumbnailHalf } from '../value-object/thumbnail-half.vo';
import { Thumbnail } from '../value-object/thumbnail.vo';
import { Trailer } from '../value-object/trailer.vo';
import { VideoMedia } from '../value-object/video-media.vo';
import { VideoId } from '../video.aggregate';
import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { CategoryId } from '@core/category/domain/category.aggregate';
import { IDomainEvent } from '@core/shared/domain/events/domain-event.interface';

export type VideoCreatedEventProps = {
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
  categories_id: CategoryId[];
  genres_id: GenreId[];
  cast_members_id: CastMemberId[];
  created_at: Date;
};

export class VideoCreatedEvent implements IDomainEvent {
  readonly aggregate_id: VideoId;
  readonly occurred_on: Date;
  readonly event_version: number;

  readonly title: string;
  readonly description: string;
  readonly year_launched: number;
  readonly duration: number;
  readonly rating: Rating;
  readonly is_opened: boolean;
  readonly is_published: boolean;
  readonly banner: Banner | null;
  readonly thumbnail: Thumbnail | null;
  readonly thumbnail_half: ThumbnailHalf | null;
  readonly trailer: Trailer | null;
  readonly video: VideoMedia | null;
  readonly categories_id: CategoryId[];
  readonly genres_id: GenreId[];
  readonly cast_members_id: CastMemberId[];
  readonly created_at: Date;

  constructor(props: VideoCreatedEventProps) {
    this.aggregate_id = props.video_id;
    this.title = props.title;
    this.description = props.description;
    this.year_launched = props.year_launched;
    this.duration = props.duration;
    this.rating = props.rating;
    this.is_opened = props.is_opened;
    this.is_published = props.is_published;
    this.banner = props.banner;
    this.thumbnail = props.thumbnail;
    this.thumbnail_half = props.thumbnail_half;
    this.trailer = props.trailer;
    this.video = props.video;
    this.categories_id = props.categories_id;
    this.genres_id = props.genres_id;
    this.cast_members_id = props.cast_members_id;
    this.created_at = props.created_at;
    this.occurred_on = new Date();
    this.event_version = 1;
  }
}
