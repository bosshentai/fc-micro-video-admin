import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { CastMemberTypes } from '@core/cast-member/domain/value-object/cast-member-type.vo';

const _keyInResponse = ['id', 'name', 'type', 'created_at'];

export class GetCastMemberFixture {
  static keyInResponse = _keyInResponse;
}

export class CreateCastMemberFixture {
  static keyInResponse = _keyInResponse;

  static arrangeForCreate() {
    const faker = CastMember.fake().anActor().withName('Member');

    return [
      {
        send_data: {
          name: faker.name,
          type: CastMemberTypes.ACTOR,
        },
        expected: {
          name: faker.name,
          type: CastMemberTypes.ACTOR,
        },
      },
      {
        send_data: {
          name: faker.name,
          type: CastMemberTypes.DIRECTOR,
        },
        expected: {
          name: faker.name,
          type: CastMemberTypes.DIRECTOR,
        },
      },
    ];
  }
}

export class updateCastMemberFixture {
  static keyInResponse = _keyInResponse;

  static arrangeForupdate() {
    const faker = CastMember.fake().aDirector().withName('Member');

    return [
      {
        send_data: {
          name: faker.name,
          type: faker.member_type.type,
        },
        expected: {
          name: faker.name,
          type: faker.member_type.type,
        },
      },
      {
        send_data: {
          name: 'name update',
        },
        expected: {
          name: 'name update',
        },
      },
      {
        send_data: {
          type: CastMemberTypes.ACTOR,
        },
        expected: {
          type: CastMemberTypes.ACTOR,
        },
      },
    ];
  }
}
