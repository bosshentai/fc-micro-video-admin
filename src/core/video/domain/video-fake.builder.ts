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
import _ from 'lodash';
import { ImageMedia } from '@core/shared/domain/value-objects/image-media.vo';
type PropsOrFactory<T> = T | ((index: number) => T);

export class VideoFakeBuilder<TBuild extends Video | Video[]> {
  private _video_id: PropsOrFactory<VideoId> | undefined = undefined;

  private _title: PropsOrFactory<string> = (_index) => this.chance.word();

  private _description: PropsOrFactory<string> = (_index) => this.chance.word();

  private _year_launched: PropsOrFactory<number> = (_index) =>
    +this.chance.year();

  private _duration: PropsOrFactory<number> = (_index) =>
    +this.chance.integer({ min: 1, max: 100 });

  private _rating: PropsOrFactory<Rating> = (_index) => Rating.createRL();

  private _opened: PropsOrFactory<boolean> = (_index) => true;

  private _banner: PropsOrFactory<Banner | null> | undefined = new Banner({
    name: 'test-name-banner.png',
    location: 'test path banner',
  });

  private _thumbnail: PropsOrFactory<Thumbnail | null> | undefined =
    new Thumbnail({
      name: 'test-name-thumbnail.png',
      location: 'test path thumbnail',
    });

  private _thumbnail_half: PropsOrFactory<ThumbnailHalf | null> | undefined =
    new ThumbnailHalf({
      name: 'test-name-thumbnail_half.png',
      location: 'test path thumbnail_half',
    });

  private _trailer: PropsOrFactory<Trailer | null> | undefined = Trailer.create(
    {
      name: 'test-name-trailer.png',
      raw_location: 'test path trailer',
    },
  );

  private _video: PropsOrFactory<VideoMedia | null> | undefined =
    VideoMedia.create({
      name: 'test-name-video.png',
      raw_location: 'test path video',
    });

  private _categories_id: PropsOrFactory<CategoryId>[] = [];
  private _genres_id: PropsOrFactory<GenreId>[] = [];

  private _cast_members_id: PropsOrFactory<CastMemberId>[] = [];

  private _created_at: PropsOrFactory<Date> | undefined = undefined;

  private countObjs: number;

  private chance: Chance.Chance;

  static aVideoWithouMedias() {
    return new VideoFakeBuilder<Video>()
      .withoutBanner()
      .withoutThumbnail()
      .withoutThumbnailHalf()
      .withoutTrailer()
      .withoutVideo();
  }

  static aVideoWithAllMedias() {
    return new VideoFakeBuilder<Video>();
  }

  static theVideosWithoutMedias(countObjs: number) {
    return new VideoFakeBuilder<Video[]>(countObjs)
      .withoutBanner()
      .withoutThumbnail()
      .withoutThumbnailHalf()
      .withoutTrailer()
      .withoutVideo();
  }

  static theVideosWithAllMedias(countObjs: number) {
    return new VideoFakeBuilder<Video[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withVideoId(valueOrFactory: PropsOrFactory<VideoId>) {
    this._video_id = valueOrFactory;
    return this;
  }

  withTitle(valueOrFactory: PropsOrFactory<string>) {
    this._title = valueOrFactory;
    return this;
  }

  withDescription(valueOrFactory: PropsOrFactory<string>) {
    this._description = valueOrFactory;
    return this;
  }

  withYearLaunched(valueOrFactory: PropsOrFactory<number>) {
    this._year_launched = valueOrFactory;
    return this;
  }

  withDuration(valueOrFactory: PropsOrFactory<number>) {
    this._duration = valueOrFactory;
    return this;
  }

  withRating(valueOrFactory: PropsOrFactory<Rating>) {
    this._rating = valueOrFactory;
    return this;
  }

  withMarkAsOpened() {
    this._opened = true;
    return this;
  }

  withMarkAsNotOpened() {
    this._opened = false;
    return this;
  }

  withBanner(valueOrFactory: PropsOrFactory<Banner | null>) {
    this._banner = valueOrFactory;
    return this;
  }

  withoutBanner() {
    this._banner = null;
    return this;
  }

  withThumbnail(valueOrFactory: PropsOrFactory<ImageMedia | null>) {
    this._thumbnail = valueOrFactory;
    return this;
  }

  withoutThumbnail() {
    this._thumbnail = null;
    return this;
  }

  withThumbnailHalf(valueOrFactory: PropsOrFactory<ImageMedia | null>) {
    this._thumbnail_half = valueOrFactory;
    return this;
  }

  withoutThumbnailHalf() {
    this._thumbnail_half = null;
    return this;
  }

  withTrailer(valueOrFactory: PropsOrFactory<Trailer | null>) {
    this._trailer = valueOrFactory;
    return this;
  }

  withTrailerComplete() {
    this._trailer = Trailer.create({
      name: 'test-name-trailer.png',
      raw_location: 'test path trailer',
    }).complete('test encoded_location trailer');
    return this;
  }

  withoutTrailer() {
    this._trailer = null;
    return this;
  }

  withVideo(valueOrFactory: PropsOrFactory<VideoMedia | null>) {
    this._video = valueOrFactory;
    return this;
  }

  withVideoComplete() {
    this._video = VideoMedia.create({
      name: 'test-name-video.png',
      raw_location: 'test path video',
    }).complete('test encoded_location video');
    return this;
  }

  withoutVideo() {
    this._video = null;
    return this;
  }

  addCategoryId(valueOrFactory: PropsOrFactory<CategoryId>) {
    this._categories_id.push(valueOrFactory);
    return this;
  }

  addGenreId(valueOrFactory: PropsOrFactory<GenreId>) {
    this._genres_id.push(valueOrFactory);
    return this;
  }

  addCastMemberId(valueOrFactory: PropsOrFactory<CastMemberId>) {
    this._cast_members_id.push(valueOrFactory);
    return this;
  }

  withInvalidTitleTooLong(value?: string) {
    this._title = value ?? this.chance.word({ length: 256 });
    return this;
  }

  withCreatedAt(valueOrFactory: PropsOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const videos = new Array(this.countObjs).fill(undefined).map((_, index) => {
      const categoryId = new CategoryId();
      const categoriesId = this._categories_id.length
        ? this.callFactory(this._categories_id, index)
        : [categoryId];

      const genreId = new GenreId();
      const genresId = this._genres_id.length
        ? this.callFactory(this._genres_id, index)
        : [genreId];

      const castMemberId = new CastMemberId();
      const castMembersId = this._cast_members_id.length
        ? this.callFactory(this._cast_members_id, index)
        : [castMemberId];

      const video = Video.create({
        title: this.callFactory(this._title, index),
        description: this.callFactory(this._description, index),
        year_launched: this.callFactory(this._year_launched, index),
        duration: this.callFactory(this._duration, index),
        rating: this.callFactory(this._rating, index),
        is_opened: this.callFactory(this._opened, index),
        banner: this.callFactory(this._banner, index)!,
        thumbnail: this.callFactory(this._thumbnail, index)!,
        thumbnail_half: this.callFactory(this._thumbnail_half, index)!,
        trailer: this.callFactory(this._trailer, index)!,
        video: this.callFactory(this._video, index)!,
        categories_id: categoriesId.map((item, index) =>
          typeof item === 'function' ? item(index) : item,
        ),
        genres_id: genresId.map((item, index) =>
          typeof item === 'function' ? item(index) : item,
        ),
        cast_members_id: castMembersId.map((item, index) =>
          typeof item === 'function' ? item(index) : item,
        ),
        ...(this._created_at && {
          created_at: this.callFactory(this._created_at, index),
        }),
      });

      video['video_id'] = !this._video_id
        ? video['video_id']
        : this.callFactory(this._video_id, index);

      video.validate();

      return video;
    });

    return this.countObjs === 1 ? (videos[0] as TBuild) : (videos as TBuild);
  }

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
        name: 'test-name-banner.png',
        location: 'test path banner',
      })
    );
  }

  get thumbnail(): Thumbnail {
    const thumbnail = this.getValue<Thumbnail>('thumbnail');
    return (
      thumbnail ??
      new Thumbnail({
        name: 'test-name-thumbnail.png',
        location: 'test path thumbnail',
      })
    );
  }

  get thumbnail_half(): ThumbnailHalf {
    const thumbnail_half = this.getValue<ThumbnailHalf>('thumbnail_half');
    return (
      thumbnail_half ??
      new ThumbnailHalf({
        name: 'test-name-thumbnail-half.png',
        location: 'test path thumbnail_half',
      })
    );
  }

  get trailer(): Trailer {
    const trailer = this.getValue<Trailer>('trailer');
    return (
      trailer ??
      Trailer.create({
        name: 'test-name-trailer.png',
        raw_location: 'test path trailer',
      })
    );
  }

  get video(): VideoMedia {
    const video = this.getValue<VideoMedia>('video');
    return (
      video ??
      Trailer.create({
        name: 'test-name-video.png',
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
    if (typeof factoryOrValue === 'function') {
      return (factoryOrValue as (index: number) => T)(index);
    }

    if (factoryOrValue instanceof Array) {
      if (Array.isArray(factoryOrValue)) {
        return factoryOrValue.map((value) =>
          this.callFactory(value, index),
        ) as unknown as T;
      }
      return factoryOrValue;
    }

    return factoryOrValue;
  }

  private getValue<T>(prop: string): T {
    const optional = ['video_id', 'created_at'];
    const privateProps = `_${prop}` as keyof this;
    if (!this[privateProps] && optional.includes(prop)) {
      throw new Error(`Property ${prop} not have factory, use 'with' methods`);
    }
    return this.callFactory(this[privateProps], 0) as T;
  }
}
