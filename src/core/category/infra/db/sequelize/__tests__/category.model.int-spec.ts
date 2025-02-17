import { DataType, Sequelize } from 'sequelize-typescript';
import { CategoryModel } from '../category.model';
import { Category } from '../../../../domain/category.entity';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';

describe('CategoryModel Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });
  // let sequelize: Sequelize;

  // beforeEach(async () => {
  //   sequelize = new Sequelize({
  //     dialect: "sqlite",
  //     storage: ":memory:",
  //     models: [CategoryModel],
  //     logging: false,
  //   });

  //   await sequelize.sync({ force: true });
  // });

  test('mapping props', () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());
    expect(attributes).toStrictEqual([
      'category_id',
      'name',
      'description',
      'is_active',
      'created_at',
    ]);
    const categoryIdAttribute = attributesMap.category_id;
    expect(categoryIdAttribute).toMatchObject({
      field: 'category_id',
      fieldName: 'category_id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttribute = attributesMap.name;
    expect(nameAttribute).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const descriptionAttribute = attributesMap.description;
    expect(descriptionAttribute).toMatchObject({
      field: 'description',
      fieldName: 'description',
      allowNull: true,
      type: DataType.TEXT(),
    });

    const is_activeAttribute = attributesMap.is_active;
    expect(is_activeAttribute).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    const created_atAttribute = attributesMap.created_at;
    expect(created_atAttribute).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      allowNull: false,
      type: DataType.DATE(3),
    });
  });

  test('create', async () => {
    const arrange = {
      category_id: '93d5a7a7-9e3a-4a4a-9e3a-4a4a9e3a4a4a',
      name: 'Movie',
      is_active: true,
      created_at: new Date(),
    };

    const category = await CategoryModel.create(arrange);
    expect(category.toJSON()).toStrictEqual(arrange);
  });

  // test("should create a category", async () => {
  //   const category = Category.fake().aCategory().build();

  //   await CategoryModel.create({
  //     category_id: category.category_id.id,
  //     name: category.name,
  //     description: category.description,
  //     is_active: category.is_active,
  //     created_at: category.created_at,
  //   });
  // });
});
