import {
  InvalidMediaFileMimeTypeError,
  InvalidMediaFileSizeError,
} from '@core/shared/domain/validator/media-file.validator';
import { Banner } from '../value-object/banner.vo';
import { VideoId } from '../video.aggregate';

describe('Banner Unit Tests', () => {
  it('should create a Banner object from a valid file', () => {
    const data = Buffer.alloc(1024);
    const videoId = new VideoId();
    const [banner, error] = Banner.createFromFile({
      raw_name: 'test.png',
      mime_type: 'image/png',
      size: 1024,
      video_id: videoId,
    }).asArray();

    expect(error).toBeUndefined();
    expect(banner).toBeInstanceOf(Banner);

    expect(banner.name).toMatch(/\.png$/);
    expect(banner.location).toBe(`videos/${videoId.id}/images`);
  });

  it('should throw an error if hte file size is too large', () => {
    const data = Buffer.alloc(Banner.max_size + 1);
    const videoId = new VideoId();
    const [banner, error] = Banner.createFromFile({
      raw_name: 'test.png',
      mime_type: 'image/png',
      size: Banner.max_size + 1,
      video_id: videoId,
    });

    expect(banner).toBeUndefined();
    expect(error).toBeInstanceOf(InvalidMediaFileSizeError);
  });

  it('should throw an error if the file mime type is not valid', () => {
    const data = Buffer.alloc(1024);
    const videoId = new VideoId();
    const [banner, error] = Banner.createFromFile({
      raw_name: 'test.text',
      mime_type: 'text/plain',
      size: data.length,
      video_id: videoId,
    });

    expect(banner).toBeUndefined();
    expect(error).toBeInstanceOf(InvalidMediaFileMimeTypeError);
  });
});
