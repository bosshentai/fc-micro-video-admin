import { Category } from '@core/category/domain/category.entity';

const _keyInResponse = ['id', 'name', 'description', 'is_active', 'created_at'];

export class GetCategoryFixture {
  static keyInResponse = _keyInResponse;
}

export class CreateCategoryFixture {
  static keyInResponse = _keyInResponse;

  static arrangeForCreate() {
    const faker = Category.fake()
      .aCategory()
      .withName('Movie')
      .withDescription('description test');

    return [
      {
        send_data: {
          name: faker.name,
        },
        expected: {
          name: faker.name,
          description: null,
          is_active: true,
        },
      },
      {
        send_data: {
          name: faker.name,
          description: faker.description,
        },
        expected: {
          name: faker.name,
          description: faker.description,
          is_active: true,
        },
      },
      {
        send_data: {
          name: faker.name,
          is_active: true,
        },
        expected: {
          nane: faker.name,
          description: null,
          is_active: true,
        },
      },
      {
        send_data: {
          name: faker.name,
          is_active: false,
        },
        expected: {
          name: faker.name,
          description: null,
          is_active: false,
        },
      },
      {
        send_data: {
          name: faker.name,
          description: faker.description,
          is_active: true,
        },
        expected: {
          name: faker.name,
          description: faker.description,
          is_active: true,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: undefined,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        send_data: {
          name: null,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        send_data: {
          name: '',
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      DESCRIPTION_NOT_A_STRING: {
        send_data: {
          description: 5,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'description must be a string',
          ],
          ...defaultExpected,
        },
      },

      IS_ACTIVE_NOT_A_BOOLEAN: {
        send_data: {
          is_active: 'a',
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'is_active must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeEntityValidationError() {
    const faker = Category.fake().aCategory();
  }
}

export class UpdateCategoryFixture {}

export class ListCategoriesFixture {}
