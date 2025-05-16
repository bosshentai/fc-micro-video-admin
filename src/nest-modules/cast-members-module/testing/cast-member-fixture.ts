import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';
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

  static arrangeInvalidRequest() {
    const faker = CastMember.fake().anActor().withName('Member');
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'type should not be empty',
            'type must be an integer number',
          ],
          ...defaultExpected,
        },
      },
      TYPE_UNDEFINED: {
        send_data: {
          name: faker.name,
          type: undefined,
        },
        expected: {
          message: [
            'type should not be empty',
            'type must be an integer number',
          ],
          ...defaultExpected,
        },
      },
      TYPE_NULL: {
        send_data: {
          name: faker.name,
          type: null,
        },
        expected: {
          message: [
            'type should not be empty',
            'type must be an integer number',
          ],
          ...defaultExpected,
        },
      },
      TYPE_EMPTY: {
        send_data: {
          name: faker.name,
          type: '',
        },
        expected: {
          message: [
            'type should not be empty',
            'type must be an integer number',
          ],
          ...defaultExpected,
        },
      },
      TYPE_NOT_NUMBER: {
        send_data: {
          name: faker.name,
          type: 'a',
        },
        expected: {
          message: ['type must be an integer number'],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: undefined,
          type: CastMemberTypes.ACTOR,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        send_data: {
          name: null,
          type: CastMemberTypes.ACTOR,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        send_data: { name: '', type: CastMemberTypes.ACTOR },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = CastMember.fake().anActor().withName('Member');

    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        send_data: {
          name: faker.withInvalidNameTooLong().name,
          type: CastMemberTypes.ACTOR,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
      TYPE_INVALID: {
        send_data: {
          name: faker.withName('Member').name,
          type: 10,
        },
        expected: {
          message: ['Invalid cast member type: 10'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class UpdateCastMemberFixture {
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

  static arrangeForEntityValidationError() {
    const faker = CastMember.fake().anActor().withName('Member');

    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        send_data: {
          name: faker.withInvalidNameTooLong().name,
          type: CastMemberTypes.ACTOR,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
      TYPE_INVALID: {
        send_data: {
          name: faker.withName('Member').name,
          type: 10,
        },
        expected: {
          message: ['Invalid cast member type: 10'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class ListCastMembersFixture {
  static arrangeIncrementedWithCreatedAt() {
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
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
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
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
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
