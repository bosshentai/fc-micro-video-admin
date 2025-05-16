import { CastMemberTypes } from '@core/cast-member/domain/value-object/cast-member-type.vo';
import { VideoCastMemberOutput } from '@core/video/application/use-cases/common/video-output';
import { Transform } from 'class-transformer';

export class VideoCastMemberPresenter {
  id: string;
  name: string;
  type: CastMemberTypes;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;
  constructor(output: VideoCastMemberOutput) {
    this.id = output.id;
    this.name = output.name;
    this.type = output.type;
    this.created_at = output.created_at;
  }
}
