import { CastMember } from '@core/cast-member/domain/cast-member.entity';

const _keyInResponse = ['id', 'name', 'type', 'created_at'];

export class GetCastMemberFixture {
  static keyInResponse = _keyInResponse;
}

export class CreateCastMemberFixture {
  static keyInResponse = _keyInResponse;

  static arrangeForCreate() {
    const faker = CastMember.fake().anActor().withName('Actor');

    return [
      {
        send_data: {
          name: faker.name,
          type: faker.member_type.type,
        },
      },
    ];
  }
}
