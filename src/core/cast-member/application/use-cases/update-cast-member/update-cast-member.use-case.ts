import { IUseCase } from '@core/shared/application/use-case.interface';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output';
import { UpdateCastMemberInput } from './update-cast-member.input';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { CastMemberType } from '@core/cast-member/domain/value-object/cast-member-type.vo';
import { EntityValidationError } from '@core/shared/domain/validator/validation.error';
import {
  CastMember,
  CastMemberId,
} from '@core/cast-member/domain/cast-member.aggregate';

export class UpdateCastMemberUseCase
  implements IUseCase<UpdateCastMemberInput, UpdateCastMemberOutput>
{
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(input: UpdateCastMemberInput): Promise<CastMemberOutput> {
    const uuid = new CastMemberId(input.id);

    const castMember = await this.castMemberRepo.findById(uuid);

    if (!castMember) {
      throw new NotFoundError(input.id, CastMember);
    }

    input.name && castMember.changeName(input.name);

    if (input.type) {
      const [type, errorCastMemberType] = CastMemberType.create(
        input.type,
      ).asArray();

      castMember.changeType(type);

      errorCastMemberType &&
        castMember.notification.setError(errorCastMemberType.message, 'type');
    }

    if (castMember.notification.hasErrors()) {
      throw new EntityValidationError(castMember.notification.toJSON());
    }

    await this.castMemberRepo.update(castMember);

    return CastMemberOutputMapper.toOutput(castMember);
  }
}

export type UpdateCastMemberOutput = CastMemberOutput;
