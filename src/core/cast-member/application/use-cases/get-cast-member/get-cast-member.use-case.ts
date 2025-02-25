import { IUseCase } from '@core/shared/application/use-case.interface';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

export class GetCastMemberUseCase
  implements IUseCase<GetCastMemberInput, GetCastMemberOutput>
{
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(input: GetCastMemberInput): Promise<CastMemberOutput> {
    const uuid = new Uuid(input.id);

    const castMember = await this.castMemberRepo.findById(uuid);

    if (!castMember) {
      throw new NotFoundError(input.id, CastMember);
    }

    return CastMemberOutputMapper.toOutput(castMember);
  }
}

export type GetCastMemberInput = {
  id: string;
};

export type GetCastMemberOutput = CastMemberOutput;
