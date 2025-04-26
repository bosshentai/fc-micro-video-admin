import { Chance } from 'chance';
import { VideoFakeBuilder } from '../video-fake.builder';
import { Video, VideoId } from '../video.aggregate';
import { CategoryId } from '@core/category/domain/category.aggregate';
import { Rating } from '../value-object/rating.vo';
import { GenreId } from '@core/genre/domain/genre.aggregate';
import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { Banner } from '../value-object/banner.vo';
import { Thumbnail } from '../value-object/thumbnail.vo';
import { ThumbnailHalf } from '../value-object/thumbnail-half.vo';
import { Trailer } from '../value-object/trailer.vo';
import { VideoMedia } from '../value-object/video-media.vo';

describe('VideoFakeBuilder Unit Tests', () => {
  describe('video_id prop', () => {
    const faker = VideoFakeBuilder.aVideoWithoutMedias();

    test('should throw error when any with methods has called', () => {
      expect(() => faker.video_id).toThrow(
        new Error("Property video_id not have factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_video_id']).toBeUndefined();
    });

    test('withVideoId', () => {
      const video_id = new VideoId();
      const $this = faker.withVideoId(video_id);
      expect($this).toBeInstanceOf(VideoFakeBuilder);
      expect($this['_video_id']).toBe(video_id);

      faker.withVideoId(() => video_id);
      expect(($this['_video_id'] as () => VideoId)()).toBe(video_id);

      expect(faker.video_id).toBe(video_id);
    });

    test('should pass index to video_id factory', () => {
      let mockFactory = jest.fn(() => new VideoId());
      faker.withVideoId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);

      const video_id = new VideoId();
      mockFactory = jest.fn(() => video_id);
      const fakerMany = VideoFakeBuilder.theVideosWithoutMedias(2);
      fakerMany.withVideoId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].video_id).toBe(video_id);
      expect(fakerMany.build()[1].video_id).toBe(video_id);
    });
  });

  describe('title prop', () => {
    const faker = VideoFakeBuilder.aVideoWithoutMedias();

    test('should be a function', () => {
      expect(typeof faker['_title']).toBe('function');
    });

    test('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();
      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withTitle', () => {
      const $this = faker.withTitle('test title');
      expect($this).toBeInstanceOf(VideoFakeBuilder);
      expect($this['_title']).toBe('test title');

      faker.withTitle(() => 'test title');

      expect((faker['_title'] as () => string)()).toBe('test title');

      expect(faker.title).toBe('test title');
    });

    test('should pass index to title factory', () => {
      faker.withTitle((index) => `test title ${index}`);
      const video = faker.build() as Video;
      expect(video.title).toBe('test title 0');

      const fakerMany = VideoFakeBuilder.theVideosWithoutMedias(2);
      fakerMany.withTitle((index) => `test title ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].title).toBe('test title 0');
      expect(categories[1].title).toBe('test title 1');
    });

    test('invalid too long case', () => {
      const $this = faker.withInvalidTitleTooLong();
      expect($this).toBeInstanceOf(VideoFakeBuilder);
      expect($this['_title'].length).toBe(256);

      const tooLong = 't'.repeat(256);
      faker.withInvalidTitleTooLong(tooLong);
      expect(faker['_title']).toBe(tooLong);
      expect(faker['_title'].length).toBe(256);
    });
  });

  describe('categories_id prop', () => {
    const faker = VideoFakeBuilder.aVideoWithoutMedias();

    it('should be a empty', () => {
      expect(faker['_categories_id']).toBeInstanceOf(Array);
    });

    test('withCategoryId', () => {
      const categoryId1 = new CategoryId();
      const $this = faker.addCategoryId(categoryId1);
      expect($this).toBeInstanceOf(VideoFakeBuilder);
      expect($this['_categories_id']).toStrictEqual([categoryId1]);

      const categoryId2 = new CategoryId();
      faker.addCategoryId(() => categoryId2);

      expect([
        faker['_categories_id'][0],
        (faker['_categories_id'][1] as () => CategoryId)(),
      ]).toStrictEqual([categoryId1, categoryId2]);
    });

    it('should pass index to categories_id factory', () => {
      const categoriesId = [new CategoryId(), new CategoryId()];
      faker.addCategoryId((index) => categoriesId[index]);
      const video = faker.build() as Video;
      expect(video.categories_id.get(categoriesId[0].id)).toBe(categoriesId[0]);

      const fakerMany = VideoFakeBuilder.theVideosWithAllMedias(2);
      fakerMany.addCategoryId((index) => categoriesId[index]);
      const videos = fakerMany.build();

      expect(videos[0].categories_id.get(categoriesId[0].id)).toBe(
        categoriesId[0],
      );

      expect(videos[1].categories_id.get(categoriesId[1].id)).toBe(
        categoriesId[1],
      );
    });
  });

  describe('created_at prop', () => {
    const faker = VideoFakeBuilder.aVideoWithoutMedias();

    test('should throw error when any with methods has called', () => {
      const fakerVideo = VideoFakeBuilder.aVideoWithoutMedias();
      expect(() => fakerVideo.created_at).toThrow(
        new Error("Property created_at not have factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_created_at']).toBeUndefined();
    });

    test('withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(VideoFakeBuilder);
      expect($this['_created_at']).toBe(date);

      faker.withCreatedAt(() => date);

      expect((faker['_created_at'] as () => Date)()).toBe(date);
      expect(faker.created_at).toBe(date);
    });

    test('should pass index to created_at factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const video = faker.build() as Video;
      expect(video.created_at.getTime()).toBe(date.getTime() + 2);

      const fakerMany = VideoFakeBuilder.theVideosWithAllMedias(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();
      expect(categories[0].created_at.getTime()).toBe(date.getTime() + 2);
      expect(categories[1].created_at.getTime()).toBe(date.getTime() + 3);
    });
  });

  it('should create a video without medias', () => {
    let video = VideoFakeBuilder.aVideoWithoutMedias().build();

    expect(video.video_id).toBeInstanceOf(VideoId);
    expect(typeof video.title === 'string').toBeTruthy();
    expect(typeof video.description === 'string').toBeTruthy();
    expect(typeof video.year_launched === 'number').toBeTruthy();
    expect(video.rating).toEqual(Rating.createRL());
    expect(video.is_opened).toBeTruthy();
    expect(video.is_published).toBeFalsy();
    expect(video.banner).toBeNull();
    expect(video.thumbnail).toBeNull();
    expect(video.thumbnail_half).toBeNull();
    expect(video.trailer).toBeNull();
    expect(video.video).toBeNull();
    expect(video.categories_id).toBeInstanceOf(Map);
    expect(video.categories_id.size).toBe(1);
    expect(video.categories_id.values().next().value).toBeInstanceOf(
      CategoryId,
    );
    expect(video.genres_id).toBeInstanceOf(Map);
    expect(video.genres_id.size).toBe(1);
    expect(video.genres_id.values().next().value).toBeInstanceOf(GenreId);
    expect(video.cast_members_id).toBeInstanceOf(Map);
    expect(video.cast_members_id.size).toBe(1);
    expect(video.cast_members_id.values().next().value).toBeInstanceOf(
      CastMemberId,
    );
    expect(video.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    const videoId = new VideoId();
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const genreId1 = new GenreId();
    const genreId2 = new GenreId();
    const castMemberId1 = new CastMemberId();
    const castMemberId2 = new CastMemberId();

    video = VideoFakeBuilder.aVideoWithoutMedias()
      .withVideoId(videoId)
      .withTitle('name test')
      .withDescription('description test')
      .withYearLaunched(2020)
      .withDuration(90)
      .withRating(Rating.createR10())
      .withMarkAsNotOpened()
      .addCategoryId(categoryId1)
      .addCategoryId(categoryId2)
      .addGenreId(genreId1)
      .addGenreId(genreId2)
      .addCastMemberId(castMemberId1)
      .addCastMemberId(castMemberId2)
      .withCreatedAt(created_at)
      .build();

    expect(video.video_id.id).toBe(videoId.id);
    expect(video.title).toBe('name test');
    expect(video.description).toBe('description test');
    expect(video.year_launched).toBe(2020);
    expect(video.duration).toBe(90);
    expect(video.rating).toEqual(Rating.createR10());
    expect(video.is_opened).toBeFalsy();
    expect(video.is_published).toBeFalsy();
    expect(video.banner).toBeNull();
    expect(video.thumbnail).toBeNull();
    expect(video.thumbnail_half).toBeNull();
    expect(video.trailer).toBeNull();
    expect(video.video).toBeNull();
    expect(video.categories_id).toBeInstanceOf(Map);
    expect(video.categories_id.get(categoryId1.id)).toBe(categoryId1);
    expect(video.categories_id.get(categoryId2.id)).toBe(categoryId2);
    expect(video.genres_id).toBeInstanceOf(Map);
    expect(video.genres_id.get(genreId1.id)).toBe(genreId1);
    expect(video.genres_id.get(genreId2.id)).toBe(genreId2);
    expect(video.cast_members_id).toBeInstanceOf(Map);
    expect(video.cast_members_id.get(castMemberId1.id)).toBe(castMemberId1);
    expect(video.cast_members_id.get(castMemberId2.id)).toBe(castMemberId2);
    expect(video.created_at).toBe(created_at);
  });

  it('should create a video with medias', () => {
    let video = VideoFakeBuilder.aVideoWithAllMedias().build();

    expect(video.video_id).toBeInstanceOf(VideoId);
    expect(typeof video.title === 'string').toBeTruthy();
    expect(typeof video.description === 'string').toBeTruthy();
    expect(typeof video.year_launched === 'number').toBeTruthy();
    expect(video.rating).toEqual(Rating.createRL());
    expect(video.is_opened).toBeTruthy();
    expect(video.is_published).toBeFalsy();
    expect(video.banner).toBeInstanceOf(Banner);
    expect(video.thumbnail).toBeInstanceOf(Thumbnail);
    expect(video.thumbnail_half).toBeInstanceOf(ThumbnailHalf);
    expect(video.trailer).toBeInstanceOf(Trailer);
    expect(video.video).toBeInstanceOf(VideoMedia);
    expect(video.categories_id).toBeInstanceOf(Map);
    expect(video.categories_id.size).toBe(1);
    expect(video.categories_id.values().next().value).toBeInstanceOf(
      CategoryId,
    );
    expect(video.genres_id).toBeInstanceOf(Map);
    expect(video.genres_id.size).toBe(1);
    expect(video.genres_id.values().next().value).toBeInstanceOf(GenreId);
    expect(video.cast_members_id).toBeInstanceOf(Map);
    expect(video.cast_members_id.size).toBe(1);
    expect(video.cast_members_id.values().next().value).toBeInstanceOf(
      CastMemberId,
    );
    expect(video.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    const videoId = new VideoId();
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const genreId1 = new GenreId();
    const genreId2 = new GenreId();
    const castMemberId1 = new CastMemberId();
    const castMemberId2 = new CastMemberId();

    const banner = new Banner({
      location: 'location',
      name: 'name',
    });

    const thumbnail = new Thumbnail({
      location: 'location',
      name: 'name',
    });

    const thumbnail_half = new ThumbnailHalf({
      location: 'location',
      name: 'name',
    });
    const trailer = Trailer.create({
      raw_location: 'location',
      name: 'name',
    });
    const videoMedia = VideoMedia.create({
      raw_location: 'location',
      name: 'name',
    });
    video = VideoFakeBuilder.aVideoWithAllMedias()
      .withVideoId(videoId)
      .withTitle('name test')
      .withDescription('description test')
      .withYearLaunched(2020)
      .withDuration(90)
      .withRating(Rating.createR10())
      .withMarkAsNotOpened()
      .addCategoryId(categoryId1)
      .addCategoryId(categoryId2)
      .addGenreId(genreId1)
      .addGenreId(genreId2)
      .addCastMemberId(castMemberId1)
      .addCastMemberId(castMemberId2)
      .withBanner(banner)
      .withThumbnail(thumbnail)
      .withThumbnailHalf(thumbnail_half)
      .withTrailer(trailer)
      .withVideo(videoMedia)
      .withCreatedAt(created_at)
      .build();

    expect(video.video_id.id).toBe(videoId.id);
    expect(video.title).toBe('name test');
    expect(video.description).toBe('description test');
    expect(video.year_launched).toBe(2020);
    expect(video.duration).toBe(90);
    expect(video.rating).toEqual(Rating.createR10());
    expect(video.is_opened).toBeFalsy();
    expect(video.is_published).toBeFalsy();
    expect(video.banner).toBe(banner);
    expect(video.thumbnail).toBe(thumbnail);
    expect(video.thumbnail_half).toBe(thumbnail_half);
    expect(video.trailer).toBe(trailer);
    expect(video.video).toBe(videoMedia);
    expect(video.categories_id).toBeInstanceOf(Map);
    expect(video.categories_id.get(categoryId1.id)).toBe(categoryId1);
    expect(video.categories_id.get(categoryId2.id)).toBe(categoryId2);
    expect(video.genres_id).toBeInstanceOf(Map);
    expect(video.genres_id.get(genreId1.id)).toBe(genreId1);
    expect(video.genres_id.get(genreId2.id)).toBe(genreId2);
    expect(video.cast_members_id).toBeInstanceOf(Map);
    expect(video.cast_members_id.get(castMemberId1.id)).toBe(castMemberId1);
    expect(video.cast_members_id.get(castMemberId2.id)).toBe(castMemberId2);
    expect(video.created_at).toBe(created_at);
  });

  it('should create many videos without medias', () => {
    const faker = VideoFakeBuilder.theVideosWithoutMedias(2);
    let videos = faker.build();
    videos.forEach((video) => {
      expect(video.video_id).toBeInstanceOf(VideoId);
      expect(typeof video.title === 'string').toBeTruthy();
      expect(typeof video.description === 'string').toBeTruthy();
      expect(typeof video.year_launched === 'number').toBeTruthy();
      expect(video.rating).toEqual(Rating.createRL());
      expect(video.is_opened).toBeTruthy();
      expect(video.is_published).toBeFalsy();
      expect(video.banner).toBeNull();
      expect(video.thumbnail).toBeNull();
      expect(video.thumbnail_half).toBeNull();
      expect(video.trailer).toBeNull();
      expect(video.video).toBeNull();
      expect(video.categories_id).toBeInstanceOf(Map);
      expect(video.categories_id.size).toBe(1);
      expect(video.categories_id.values().next().value).toBeInstanceOf(
        CategoryId,
      );
      expect(video.genres_id).toBeInstanceOf(Map);
      expect(video.genres_id.size).toBe(1);
      expect(video.genres_id.values().next().value).toBeInstanceOf(GenreId);
      expect(video.cast_members_id).toBeInstanceOf(Map);
      expect(video.cast_members_id.size).toBe(1);
      expect(video.cast_members_id.values().next().value).toBeInstanceOf(
        CastMemberId,
      );
      expect(video.created_at).toBeInstanceOf(Date);
    });
  });

  it('should create many videos with medias', () => {
    const faker = VideoFakeBuilder.theVideosWithAllMedias(2);
    let videos = faker.build();
    videos.forEach((video) => {
      expect(video.video_id).toBeInstanceOf(VideoId);
      expect(typeof video.title === 'string').toBeTruthy();
      expect(typeof video.description === 'string').toBeTruthy();
      expect(typeof video.year_launched === 'number').toBeTruthy();
      expect(video.rating).toEqual(Rating.createRL());
      expect(video.is_opened).toBeTruthy();
      expect(video.is_published).toBeFalsy();
      expect(video.banner).toBeInstanceOf(Banner);
      expect(video.thumbnail).toBeInstanceOf(Thumbnail);
      expect(video.thumbnail_half).toBeInstanceOf(ThumbnailHalf);
      expect(video.trailer).toBeInstanceOf(Trailer);
      expect(video.video).toBeInstanceOf(VideoMedia);
      expect(video.categories_id).toBeInstanceOf(Map);
      expect(video.categories_id.size).toBe(1);
      expect(video.categories_id.values().next().value).toBeInstanceOf(
        CategoryId,
      );
      expect(video.genres_id).toBeInstanceOf(Map);
      expect(video.genres_id.size).toBe(1);
      expect(video.genres_id.values().next().value).toBeInstanceOf(GenreId);
      expect(video.cast_members_id).toBeInstanceOf(Map);
      expect(video.cast_members_id.size).toBe(1);
      expect(video.cast_members_id.values().next().value).toBeInstanceOf(
        CastMemberId,
      );
      expect(video.created_at).toBeInstanceOf(Date);
    });

    const created_at = new Date();
    const videoId = new VideoId();
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const genreId1 = new GenreId();
    const genreId2 = new GenreId();
    const castMemberId1 = new CastMemberId();
    const castMemberId2 = new CastMemberId();
    const banner = new Banner({
      name: 'test-name-banner.png',
      location: 'test path banner',
    });
    const thumbnail = new Thumbnail({
      name: 'test-name-thumbnail.png',
      location: 'test path thumbnail',
    });
    const thumbnail_half = new ThumbnailHalf({
      name: 'test-name-thumbnail_half.png',
      location: 'test path thumbnail_half',
    });
    const trailer = Trailer.create({
      name: 'test-name-trailer.png',
      raw_location: 'test path trailer',
    });
    const videoMedia = VideoMedia.create({
      name: 'test-name-video.png',
      raw_location: 'test path video',
    });

    videos = VideoFakeBuilder.theVideosWithAllMedias(2)
      .withVideoId(videoId)
      .withTitle('name test')
      .withDescription('description test')
      .withYearLaunched(2020)
      .withDuration(90)
      .withRating(Rating.createR10())
      .withMarkAsNotOpened()
      .addCategoryId(categoryId1)
      .addCategoryId(categoryId2)
      .addGenreId(genreId1)
      .addGenreId(genreId2)
      .addCastMemberId(castMemberId1)
      .addCastMemberId(castMemberId2)
      .withBanner(banner)
      .withThumbnail(thumbnail)
      .withThumbnailHalf(thumbnail_half)
      .withTrailer(trailer)
      .withVideo(videoMedia)
      .withCreatedAt(created_at)
      .build();
    videos.forEach((video) => {
      expect(video.video_id).toBeInstanceOf(VideoId);
      expect(video.video_id.id).toEqual(videoId.id);
      expect(video.title).toEqual('name test');
      expect(video.description).toEqual('description test');
      expect(video.year_launched).toEqual(2020);
      expect(video.duration).toEqual(90);
      expect(video.rating).toEqual(Rating.createR10());
      expect(video.is_opened).toBeFalsy();
      expect(video.is_published).toBeFalsy();
      expect(video.banner).toBeInstanceOf(Banner);
      expect(video.thumbnail).toBe(thumbnail);
      expect(video.thumbnail_half).toBe(thumbnail_half);
      expect(video.trailer).toBe(trailer);
      expect(video.video).toBe(videoMedia);
      expect(video.categories_id).toBeInstanceOf(Map);
      expect(video.categories_id.size).toBe(2);
      expect(video.genres_id).toBeInstanceOf(Map);
      expect(video.genres_id.size).toBe(2);
      expect(video.genres_id.get(genreId1.id)).toBe(genreId1);
      expect(video.genres_id.get(genreId2.id)).toBe(genreId2);
      expect(video.cast_members_id).toBeInstanceOf(Map);
      expect(video.cast_members_id.size).toBe(2);
      expect(video.cast_members_id.get(castMemberId1.id)).toBe(castMemberId1);
      expect(video.cast_members_id.get(castMemberId2.id)).toBe(castMemberId2);
      expect(video.created_at).toBe(created_at);
    });
  });
});
