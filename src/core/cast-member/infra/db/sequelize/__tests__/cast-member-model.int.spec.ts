import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { CastMemberModel } from '../cast-member.model';
import { DataType } from 'sequelize-typescript';
import { CastMemberTypes } from '@core/cast-member/domain/value-object/cast-member-type.vo';

describe('CastMemberModel Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  test('mapping props', () => {
    const attributsMap = CastMemberModel.getAttributes();
    const attributes = Object.keys(CastMemberModel.getAttributes());
    expect(attributes).toStrictEqual([
      'cast_member_id',
      'name',
      'type',
      'created_at',
    ]);

    const castMemberIdAttr = attributsMap.cast_member_id;
    expect(castMemberIdAttr).toMatchObject({
      field: 'cast_member_id',
      fieldName: 'cast_member_id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributsMap.name;
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const typeAttr = attributsMap.type;
    expect(typeAttr).toMatchObject({
      field: 'type',
      fieldName: 'type',
      allowNull: false,
      type: DataType.SMALLINT(),
    });

    const createdAtAttr = attributsMap.created_at;
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      allowNull: false,
      type: DataType.DATE(3),
    });
  });

  test('create', async () => {
    const arrange = {
      cast_member_id: '34534534-3453-3453-3453-345345345345',
      name: 'John Doe',
      type: CastMemberTypes.ACTOR,
      created_at: new Date(),
    };

    const castMember = await CastMemberModel.create(arrange);
    expect(castMember.toJSON()).toStrictEqual(arrange);
  });
});
