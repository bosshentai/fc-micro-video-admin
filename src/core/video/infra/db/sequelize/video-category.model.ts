import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { VideoModel } from './video.model';
import { CategoryModel } from '../../../../category/infra/db/sequelize/category.model';

export type VideoCategoryModelProps = {
  video_id: string;
  category_id: string;
};

@Table({ tableName: 'category_video', timestamps: false })
export class VideoCategoryModel extends Model<VideoCategoryModelProps> {
  @PrimaryKey
  @ForeignKey(() => VideoModel)
  @Column({
    type: DataType.UUID,
  })
  declare video_id: string;

  @PrimaryKey
  @ForeignKey(() => CategoryModel)
  @Column({
    type: DataType.UUID,
  })
  declare category_id: string;
}
