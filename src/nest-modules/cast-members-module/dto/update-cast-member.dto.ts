import { UpdateCastMemberInput } from '@core/cast-member/application/use-cases/update-cast-member/update-cast-member.input';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateCastMemberWithoutId extends OmitType(UpdateCastMemberInput, [
  'id',
] as const) {}

export class UpdateCastMemberDto extends UpdateCastMemberWithoutId {}
