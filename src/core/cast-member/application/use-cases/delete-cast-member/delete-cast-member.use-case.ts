import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { IUseCase } from '@core/shared/application/use-case.interface';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';

export class DeleteCastMemberUseCase
  implements IUseCase<DeleteCastMemberInput, DeleteCastMemberOutput>
{
  constructor(private castMemberRepo: ICastMemberRepository) {}
  async execute(input: DeleteCastMemberInput): Promise<void> {
    const castMemberId = new Uuid(input.id);
    await this.castMemberRepo.delete(castMemberId);
  }
}

export type DeleteCastMemberInput = {
  id: string;
};

type DeleteCastMemberOutput = void;
