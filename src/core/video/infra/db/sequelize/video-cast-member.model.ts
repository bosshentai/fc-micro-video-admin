import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CastMemberModel } from '../../../../cast-member/infra/db/sequelize/cast-member.model';
import { VideoModel } from './video.model';
export type VideoCastMemberProps = {
  video_id: string;
  cast_member_id: string;
};

@Table({ tableName: 'cast_member_video', timestamps: false })
export class VideoCastMemberModel extends Model<VideoCastMemberProps> {
  @PrimaryKey
  @ForeignKey(() => VideoModel)
  @Column({ type: DataType.UUID })
  declare video_id: string;

  @PrimaryKey
  @ForeignKey(() => CastMemberModel)
  @Column({ type: DataType.UUID })
  declare cast_member_id: string;
}
