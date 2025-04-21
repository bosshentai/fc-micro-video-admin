import { DataType } from 'sequelize-typescript';
import { setupSequelizeForVideo } from '../testing/helpers';
import { VideoCategoryModel } from '../video-category.model';

describe('VideoCategoryModel Unit Tests', () => {
  setupSequelizeForVideo();

  test('table name', () => {
    expect(VideoCategoryModel.tableName).toBe('category_video');
  });

  test('mapping props', () => {
    const attributesMap = VideoCategoryModel.getAttributes();
    const attributes = Object.keys(VideoCategoryModel.getAttributes());
    expect(attributes).toStrictEqual(['video_id', 'category_id']);

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
      unique: 'category_video_video_id_category_id_unique',
    });

    const categoryIdAttr = attributesMap.category_id;
    expect(categoryIdAttr).toMatchObject({
      field: 'category_id',
      fieldName: 'category_id',
      primaryKey: true,
      type: DataType.UUID(),
      references: {
        model: 'categories',
        key: 'category_id',
      },
      unique: 'category_video_video_id_category_id_unique',
    });
  });
});
