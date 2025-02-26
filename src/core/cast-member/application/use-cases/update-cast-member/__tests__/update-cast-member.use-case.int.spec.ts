import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize';
import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { UpdateCastMemberInput } from '../update-cast-member.input';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { CastMemberTypes } from '@core/cast-member/domain/value-object/cast-member-type.vo';

describe('UpdateCastMemberUseCase Integration Tests', () => {
  let useCase: UpdateCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new UpdateCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();

    await expect(() =>
      useCase.execute(new UpdateCastMemberInput({ id: uuid.id, name: 'fake' })),
    ).rejects.toThrow(new NotFoundError(uuid.id, CastMember));
  });

  it('should update a cast member', async () => {
    const entity = CastMember.fake().anActor().build();
    await repository.insert(entity);

    let output = await useCase.execute(
      new UpdateCastMemberInput({
        id: entity.cast_member_id.id,
        name: 'fake',
        type: CastMemberTypes.ACTOR,
      }),
    );

    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'fake',
      type: CastMemberTypes.ACTOR,
      created_at: entity.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        type: CastMemberTypes;
      };
      expected: {
        id: string;
        name: string;
        type: CastMemberTypes;
        created_at: Date;
      };
    };

    const arrange: Arrange[] = [
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: CastMemberTypes.DIRECTOR,
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: CastMemberTypes.DIRECTOR,
          created_at: entity.created_at,
        },
      },
    ];

    for (const item of arrange) {
      output = await useCase.execute({
        id: item.input.id,
        name: item.input.name,
        type: item.input.type,
      });

      const entityUpdated = await repository.findById(new Uuid(item.input.id));

      expect(output).toStrictEqual({
        id: entity.cast_member_id.id,
        name: item.expected.name,
        type: item.expected.type,
        created_at: entity.created_at,
      });

      expect(entityUpdated!.toJSON()).toStrictEqual({
        cast_member_id: entity.cast_member_id.id,
        name: item.expected.name,
        type: item.expected.type,
        created_at: entity.created_at,
      });
    }
  });
});
