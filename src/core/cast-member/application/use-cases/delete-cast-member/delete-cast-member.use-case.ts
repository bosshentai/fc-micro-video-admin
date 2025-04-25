import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { IUseCase } from '@core/shared/application/use-case.interface';

export class DeleteCastMemberUseCase
  implements IUseCase<DeleteCastMemberInput, DeleteCastMemberOutput>
{
  constructor(private castMemberRepo: ICastMemberRepository) {}
  async execute(input: DeleteCastMemberInput): Promise<void> {
    const castMemberId = new CastMemberId(input.id);
    await this.castMemberRepo.delete(castMemberId);
  }
}

export type DeleteCastMemberInput = {
  id: string;
};

type DeleteCastMemberOutput = void;
