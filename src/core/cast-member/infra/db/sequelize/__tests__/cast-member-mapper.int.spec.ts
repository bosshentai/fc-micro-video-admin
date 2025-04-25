import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { CastMemberModel } from '../cast-member.model';
import {
  EntityValidationError,
  LoadEntityError,
} from '@core/shared/domain/validator/validation.error';
import { CastMemberModelMapper } from '../cast-member.mapper';
import {
  CastMemberType,
  CastMemberTypes,
} from '@core/cast-member/domain/value-object/cast-member-type.vo';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';

describe('CastMemberMapper Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  it('should throw error when cast member is invalid', () => {
    //@ts-expect-error - This is an invalid cast member
    const model = CastMemberModel.build({
      cast_member_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
    });

    try {
      CastMemberModelMapper.toEntity(model);
      fail('The cast member is valid, but it needs throws a LoadEntityError');
    } catch (error) {
      expect(error).toBeInstanceOf(LoadEntityError);
      expect((error as EntityValidationError).error).toMatchObject([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
        {
          type: ['Invalid cast member type: undefined'],
        },
      ]);
    }
  });

  it('should convert a cast member model to a cast member entity', () => {
    const create_at = new Date();
    const model = CastMemberModel.build({
      cast_member_id: '43452c0a-2d71-4799-b91c-c64adb205104',
      name: 'name test',
      type: CastMemberTypes.ACTOR,
      created_at: create_at,
    });

    const castMember = CastMemberModelMapper.toEntity(model);
    expect(castMember.toJSON()).toStrictEqual(
      new CastMember({
        cast_member_id: new Uuid('43452c0a-2d71-4799-b91c-c64adb205104'),
        name: 'name test',
        cast_member_type: CastMemberType.createActor(),
        created_at: create_at,
      }).toJSON(),
    );
  });
});
