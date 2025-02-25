import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { ListCastMembersUseCase } from '../list-cast-member.use-case';
import { CastMemberSearchResult } from '@core/cast-member/domain/cast-member.repository';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { CastMemberType } from '@core/cast-member/domain/value-object/cast-member-type.vo';
import { CastMemberOutputMapper } from '../../common/cast-member-output';

describe('ListCastMembers Unit Tests', () => {
  let useCase: ListCastMembersUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new ListCastMembersUseCase(repository);
  });

  test('toOutput method', () => {
    let result = new CastMemberSearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    let output = useCase['toOutput'](result);

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    const entity = CastMember.create({
      name: 'test',
      cast_member_type: CastMemberType.createActor(),
    });

    result = new CastMemberSearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    output = useCase['toOutput'](result);

    expect(output).toStrictEqual({
      items: [entity].map(CastMemberOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  it('should return output using pagination, sort and filter', async () => {
    const items = [
      CastMember.fake().anActor().withName('a').build(),
      CastMember.fake().anActor().withName('AAA').build(),
      CastMember.fake().anActor().withName('AaA').build(),
      CastMember.fake().anActor().withName('b').build(),
      CastMember.fake().anActor().withName('c').build(),
    ];

    repository.items = items;

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      filter: { name: 'a' },
    });

    expect(output).toStrictEqual({
      items: [items[1], items[2]].map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: 'name',
      filter: { name: 'a' },
    });

    expect(output).toStrictEqual({
      items: [items[0]].map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      filter: { type: CastMemberType.createActor().type },
    });

    expect(output).toStrictEqual({
      items: [items[1], items[2]].map(CastMemberOutputMapper.toOutput),
      total: 5,
      current_page: 1,
      per_page: 2,
      last_page: 3,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: { type: CastMemberType.createActor().type },
    });

    expect(output).toStrictEqual({
      items: [items[4], items[3]].map(CastMemberOutputMapper.toOutput),
      total: 5,
      current_page: 1,
      per_page: 2,
      last_page: 3,
    });
  });
});
