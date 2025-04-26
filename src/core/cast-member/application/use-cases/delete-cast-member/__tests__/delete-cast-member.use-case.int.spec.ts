import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize';
import { DeleteCastMemberUseCase } from '../delete-cast-member.use-case';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';

describe('DeleteCastMemberUseCase Integration Tests', () => {
  let useCase: DeleteCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new DeleteCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();

    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, CastMember),
    );
  });

  it('should delete a cast member', async () => {
    const castMember = CastMember.fake().anActor().build();
    await repository.insert(castMember);

    await useCase.execute({ id: castMember.cast_member_id.id });

    await expect(
      repository.findById(castMember.cast_member_id),
    ).resolves.toBeNull();
  });
});
