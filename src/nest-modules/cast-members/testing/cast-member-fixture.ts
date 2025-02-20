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

export class ListCastMembersFixture {
  static arrangeIncrementWithCreatedAt() {
    const _entities = CastMember.fake()
      .theActors(4)
      .withName((i) => i + '')
      .withCreatedAt((i) => new Date(new Date().getTime() + 2000 * i))
      .build();

    const entitiesMap = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
    };

    const arrange = [
      {
        send_data: {},
        expected: {
          entities: [
            entitiesMap.fourth,
            entitiesMap.third,
            entitiesMap.second,
            entitiesMap.first,
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
      },
    ];

    return { entitiesMap, arrange };
  }

  static arrangeUnsorted() {
    const faker = CastMember.fake().anActor();

    const entitiesMap = {
      a: faker.withName('a').build(),
      AAA: faker.withName('AAA').build(),
      AaA: faker.withName('AaA').build(),
      b: faker.withName('b').build(),
      c: faker.withName('c').build(),
    };

    const arrange = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: {
            name: 'a',
          },
        },
        expected: {
          entities: [entitiesMap.AAA, entitiesMap.AaA],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: {
            name: 'a',
          },
        },
        expected: {
          entities: [entitiesMap.a],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: {
            name: 'a',
            type: CastMemberTypes.DIRECTOR,
          },
        },
        expected: {
          entities: [],
          meta: {
            current_page: 1,
            last_page: 0,
            per_page: 2,
            total: 0,
          },
        },
      },
    ];

    return { entitiesMap, arrange };
  }
}
