import { CategoryId } from '@core/category/domain/category.aggregate';
import { Banner } from './value-object/banner.vo';
import { Rating } from './value-object/rating.vo';
import { ThumbnailHalf } from './value-object/thumbnail-half.vo';
import { Thumbnail } from './value-object/thumbnail.vo';
import { Trailer } from './value-object/trailer.vo';
import { VideoMedia } from './value-object/video-media.vo';
import { Video, VideoId } from './video.aggregate';
import { Chance } from 'chance';
import { GenreId } from '@core/genre/domain/genre.aggregate';
import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
type PropsOrFactory<T> = T | ((index: number) => T);

export class VideoFakeBuilder<TBuilb extends Video | Video[]> {
  private _video_id: PropsOrFactory<VideoId> | undefined = undefined;

  private _title: PropsOrFactory<string> = (_index) => this.chance.word();

  private _description: PropsOrFactory<string | null> = (_index) =>
    this.chance.word();

  private _year_launched: PropsOrFactory<number> = (_index) =>
    +this.chance.year();

  private _duration: PropsOrFactory<number> = (_index) =>
    +this.chance.integer({ min: 1, max: 100 });

  private _rating: PropsOrFactory<Rating> = (_index) => Rating.createRL();

  private _opened: PropsOrFactory<boolean> = (_index) => true;

  private _banner: PropsOrFactory<Banner | null> | undefined = new Banner({
    name: 'test-name-banner,png',
    location: 'test path banner',
  });

  private _thumbnail: PropsOrFactory<Thumbnail | null> | undefined =
    new Thumbnail({
      name: 'test-name-thumbnail,png',
      location: 'test path thumbnail',
    });

  private _thumbnail_half: PropsOrFactory<ThumbnailHalf | null> | undefined =
    new ThumbnailHalf({
      name: 'test-name-thumbnail_half,png',
      location: 'test path thumbnail_half',
    });

  private _trailer: PropsOrFactory<Trailer | null> | undefined = Trailer.create(
    {
      name: 'test-name-trailer,png',
      raw_location: 'test path trailer',
    },
  );

  private _video: PropsOrFactory<VideoMedia | null> | undefined =
    VideoMedia.create({
      name: 'test-name-video,png',
      raw_location: 'test path video',
    });

  private _categories_id: PropsOrFactory<CategoryId>[] = [];
  private _genres_id: PropsOrFactory<GenreId>[] = [];

  private _cast_members_id: PropsOrFactory<CastMemberId>[] = [];

  private _created_at: PropsOrFactory<Date> | undefined = undefined;

  private countObjs: number;

  private chance: Chance.Chance;

  static aVideoWithouMedias() {
    //  return new VideoFakeBuilder<Video>(1);
  }

  static aVideoWithAllMedias() {
    //  return new
    //
    // VideoFakeBuilder<Video>(1);
  }

  build() {}

  get video_id() {
    return this.getValue<VideoId>('video_id');
  }

  get title() {
    return this.getValue<string>('title');
  }

  get description() {
    return this.getValue<string>('description');
  }

  get year_launched() {
    return this.getValue<number>('year_launched');
  }

  get duration() {
    return this.getValue<number>('duration');
  }

  get rating() {
    return this.getValue<Rating>('rating');
  }

  get is_opened() {
    return this.getValue<boolean>('is_opened');
  }

  get banner(): Banner {
    const banner = this.getValue<Banner>('banner');
    return (
      banner ??
      new Banner({
        name: 'test-name-banner,png',
        location: 'test path banner',
      })
    );
  }

  get thumbnail(): Thumbnail {
    const thumbnail = this.getValue<Thumbnail>('thumbnail');
    return (
      thumbnail ??
      new Thumbnail({
        name: 'test-name-thumbnail,png',
        location: 'test path thumbnail',
      })
    );
  }

  get thumbnail_half(): ThumbnailHalf {
    const thumbnail_half = this.getValue<ThumbnailHalf>('thumbnail_half');
    return (
      thumbnail_half ??
      new ThumbnailHalf({
        name: 'test-name-thumbnail-half,png',
        location: 'test path thumbnail_half',
      })
    );
  }

  get trailer(): Trailer {
    const trailer = this.getValue<Trailer>('trailer');
    return (
      trailer ??
      Trailer.create({
        name: 'test-name-trailer,png',
        raw_location: 'test path trailer',
      })
    );
  }

  get video(): VideoMedia {
    const video = this.getValue<VideoMedia>('video');
    return (
      video ??
      Trailer.create({
        name: 'test-name-video,png',
        raw_location: 'test path video',
      })
    );
  }

  get categories_id(): CategoryId[] {
    let categories_id = this.getValue<CategoryId[]>('categories_id');

    if (!categories_id.length) {
      categories_id = [new CategoryId()];
    }
    return categories_id;
  }

  get genres_id(): GenreId[] {
    let genres_id = this.getValue<GenreId[]>('genres_id');

    if (!genres_id.length) {
      genres_id = [new GenreId()];
    }
    return genres_id;
  }

  get cast_members_id(): CastMemberId[] {
    let cast_members_id = this.getValue<CastMemberId[]>('cast_members_id');

    if (!cast_members_id.length) {
      cast_members_id = [new CastMemberId()];
    }
    return cast_members_id;
  }

  get created_at() {
    return this.getValue<Date>('created_at');
  }

  private callFactory<T>(factoryOrValue: PropsOrFactory<T>, index: number): T {
    return typeof factoryOrValue === 'function'
      ? (factoryOrValue as (index: number) => T)(index)
      : factoryOrValue;
  }

  private getValue<T>(prop: string): T {
    const optional = ['genre_id', 'created_at'];
    const privateProps = `_${prop}` as keyof this;
    if (!this[privateProps] && optional.includes(prop)) {
      throw new Error(`Property ${prop} not have factory, use 'with' methods`);
    }
    return this.callFactory(this[privateProps], 0) as T;
  }
}
