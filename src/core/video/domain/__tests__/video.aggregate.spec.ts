import { CategoryId } from '@core/category/domain/category.aggregate';
import { Video, VideoId } from '../video.aggregate';
import { GenreId } from '@core/genre/domain/genre.aggregate';
import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { Rating } from '../value-object/rating.vo';
import { Banner } from '../value-object/banner.vo';
import { Thumbnail } from '../value-object/thumbnail.vo';
import { ThumbnailHalf } from '../value-object/thumbnail-half.vo';
import { Trailer } from '../value-object/trailer.vo';
import { VideoMedia } from '../value-object/video-media.vo';

describe('Video Unit Tests', () => {
  beforeEach(() => {
    Video.prototype.validate = jest
      .fn()
      .mockImplementation(Video.prototype.validate);
  });

  test('constructor of video', () => {
    const categoryId = new CategoryId();
    const categoriesId = new Map<string, CategoryId>([
      [categoryId.id, categoryId],
    ]);
    const genreId = new GenreId();
    const genresId = new Map<string, GenreId>([[genreId.id, genreId]]);
    const castMemberId = new CastMemberId();
    const castMembersId = new Map<string, CastMemberId>([
      [castMemberId.id, castMemberId],
    ]);
    const rating = Rating.createRL();
    let video = new Video({
      title: 'test title',
      description: 'test description',
      year_launched: 2025,
      duration: 90,
      rating,
      is_opened: true,
      is_published: true,
      categories_id: categoriesId,
      genres_id: genresId,
      cast_members_id: castMembersId,
    });

    expect(video).toBeInstanceOf(Video);
    expect(video.video_id).toBeInstanceOf(VideoId);
    expect(video.title).toBe('test title');
    expect(video.description).toBe('test description');
    expect(video.year_launched).toBe(2025);
    expect(video.duration).toBe(90);
    expect(video.rating).toBeInstanceOf(Rating);
    expect(video.is_opened).toBe(true);
    expect(video.is_published).toBe(true);
    expect(video.banner).toBeNull();
    expect(video.trailer).toBeNull();
    expect(video.thumbnail).toBeNull();
    expect(video.thumbnail_half).toBeNull();
    expect(video.video).toBeNull();
    expect(video.categories_id).toBe(categoriesId);
    expect(video.genres_id).toBe(genresId);
    expect(video.cast_members_id).toBe(castMembersId);
    expect(video.created_at).toBeInstanceOf(Date);

    const banner = new Banner({
      name: 'test name banner',
      location: 'test location banner',
    });

    const thumbnail = new Thumbnail({
      name: 'test name thumbnail',
      location: 'test location thumbnail',
    });

    const thumbnailHalf = new ThumbnailHalf({
      name: 'test name thumbnail half',
      location: 'test location thumbnail half',
    });

    const trailer = Trailer.create({
      name: 'test name trailer',
      raw_location: 'test location trailer',
    });

    const videoMedia = VideoMedia.create({
      name: 'test name video',
      raw_location: 'test location video',
    });

    video = new Video({
      title: 'test title',
      description: 'test description',
      year_launched: 2025,
      duration: 90,
      rating,
      is_opened: true,
      is_published: true,
      categories_id: categoriesId,
      genres_id: genresId,
      cast_members_id: castMembersId,
      banner,
      trailer,
      thumbnail,
      thumbnail_half: thumbnailHalf,
      video: videoMedia,
    });

    expect(video).toBeInstanceOf(Video);
    expect(video.video_id).toBeInstanceOf(VideoId);
    expect(video.title).toBe('test title');
    expect(video.description).toBe('test description');
    expect(video.year_launched).toBe(2025);
    expect(video.duration).toBe(90);
    expect(video.rating).toBeInstanceOf(Rating);
    expect(video.is_opened).toBe(true);
    expect(video.is_published).toBe(true);
    expect(video.banner).toBeInstanceOf(Banner);
    expect(video.trailer).toBeInstanceOf(Trailer);
    expect(video.thumbnail).toBeInstanceOf(Thumbnail);
    expect(video.thumbnail_half).toBeInstanceOf(ThumbnailHalf);
    expect(video.video).toBeInstanceOf(VideoMedia);
    expect(video.categories_id).toBe(categoriesId);
    expect(video.genres_id).toBe(genresId);
    expect(video.cast_members_id).toBe(castMembersId);
    expect(video.created_at).toBeInstanceOf(Date);
  });

  describe('video_id field', () => {
    const arrange = [
      {},
      { id: null },
      { id: undefined },
      { id: new VideoId() },
    ];

    test.each(arrange)('when props is %j', (item) => {
      const video = new Video(item as any);
      expect(video.video_id).toBeInstanceOf(VideoId);
    });
  });

  describe('create command', () => {
    test('should create a video and no publish video media', () => {
      // todo: later
      const categoriesId = [new CategoryId()];
      const genresId = [new GenreId()];
      const castMembersId = [new CastMemberId()];

      // const spyOnVideoCreated = jest.spyOn(Video.prototype, 'onVideoCreated');
    });
  });
});
