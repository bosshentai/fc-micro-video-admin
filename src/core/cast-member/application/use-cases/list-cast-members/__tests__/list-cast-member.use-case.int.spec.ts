import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { ListCastMembersUseCase } from '../list-cast-member.use-case';
import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { CastMemberOutputMapper } from '../../common/cast-member-output';

describe('ListCastMembers Integration Tests', () => {
  let useCase: ListCastMembersUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new ListCastMembersUseCase(repository);
  });

  it('should return out sorted bt created_at when input param is empty', async () => {
    const castMembers = CastMember.fake()
      .theCastMembers(2)
      .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
      .build();

    await repository.bulkInsert(castMembers);

    const output = await useCase.execute({});
    expect(output).toEqual({
      items: [...castMembers]
        .reverse()
        .map((castMember) => CastMemberOutputMapper.toOutput(castMember)),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });
});
