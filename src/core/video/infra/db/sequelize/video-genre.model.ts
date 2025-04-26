import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { GenreModel } from '../../../../genre/infra/db/sequelize/genre-model';
import { VideoModel } from './video.model';

export type VideoGenreModelProps = {
  video_id: string;
  genre_id: string;
};

@Table({ tableName: 'genre_video', timestamps: false })
export class VideoGenreModel extends Model<VideoGenreModelProps> {
  @PrimaryKey
  @ForeignKey(() => VideoModel)
  @Column({ type: DataType.UUID })
  declare video_id: string;

  @PrimaryKey
  @ForeignKey(() => GenreModel)
  @Column({ type: DataType.UUID })
  declare genre_id: string;
}
