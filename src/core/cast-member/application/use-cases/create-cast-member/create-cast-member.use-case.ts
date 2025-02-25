import { IUseCase } from '@core/shared/application/use-case.interface';
import { CreateCastMemberInput } from './create-cast-member.input';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { CastMemberType } from '@core/cast-member/domain/value-object/cast-member-type.vo';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { EntityValidationError } from '@core/shared/domain/validator/validation.error';
export class CreateCastMemberUseCase
  implements IUseCase<CreateCastMemberInput, CreateCastMemberOutput>
{
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(input: CreateCastMemberInput): Promise<CastMemberOutput> {
    const [type, errorCastMemberType] = CastMemberType.create(
      input.type,
    ).asArray();

    const entity = CastMember.create({
      ...input,
      cast_member_type: type,
    });

    const notification = entity.notification;

    if (errorCastMemberType) {
      notification.setError(errorCastMemberType.message, 'type');
    }

    if (notification.hasErrors()) {
      throw new EntityValidationError(notification.toJSON());
    }

    await this.castMemberRepo.insert(entity);
    return CastMemberOutputMapper.toOutput(entity);
  }
}

export type CreateCastMemberOutput = CastMemberOutput;
