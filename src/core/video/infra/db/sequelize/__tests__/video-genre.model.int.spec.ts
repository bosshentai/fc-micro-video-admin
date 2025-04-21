import { DataType } from 'sequelize-typescript';
import { setupSequelizeForVideo } from '../testing/helpers';
import { VideoGenreModel } from '../video-genre.model';

describe('VideoGenreModel Unit Tests', () => {
  setupSequelizeForVideo();

  test('table name', () => {
    expect(VideoGenreModel.tableName).toBe('genre_video');
  });

  test('mapping props', () => {
    const attributesMap = VideoGenreModel.getAttributes();
    const attributes = Object.keys(VideoGenreModel.getAttributes());
    expect(attributes).toStrictEqual(['video_id', 'genre_id']);

    const videoIdAttr = attributesMap.video_id;
    expect(videoIdAttr).toMatchObject({
      field: 'video_id',
      fieldName: 'video_id',
      primaryKey: true,
      type: DataType.UUID(),
      references: {
        model: 'videos',
        key: 'video_id',
      },
      unique: 'genre_video_video_id_genre_id_unique',
    });

    const genreIdAttr = attributesMap.genre_id;
    expect(genreIdAttr).toMatchObject({
      field: 'genre_id',
      fieldName: 'genre_id',
      primaryKey: true,
      type: DataType.UUID(),
      references: {
        model: 'genres',
        key: 'genre_id',
      },
      unique: 'genre_video_video_id_genre_id_unique',
    });
  });
});
