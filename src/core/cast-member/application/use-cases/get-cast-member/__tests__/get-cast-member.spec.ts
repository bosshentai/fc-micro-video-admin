import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { GetCastMemberUseCase } from '../get-cast-member.use-case';
import { InvalidUuidError } from '@core/shared/domain/value-objects/uuid.vo';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';

describe('GetCastMemberUseCase unit Tests', () => {
  let useCase: GetCastMemberUseCase;
  let reposiory: CastMemberInMemoryRepository;

  beforeEach(() => {
    reposiory = new CastMemberInMemoryRepository();
    useCase = new GetCastMemberUseCase(reposiory);
  });

  it('should throw error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );
  });

  it('should returns a category', async () => {
    const items = [CastMember.fake().anActor().withName('test').build()];

    reposiory.items = items;

    const spyFindById = jest.spyOn(reposiory, 'findById');
    const output = await useCase.execute({ id: items[0].cast_member_id.id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].cast_member_id.id,
      name: items[0].name,
      type: items[0].member_type.type,
      created_at: items[0].created_at,
    });
  });
});
