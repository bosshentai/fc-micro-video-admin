import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { GenreModel } from '../genre-model';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { GenreCategoryModel } from '../genre-category-model';
import { DataType } from 'sequelize-typescript';
import { Category } from '@core/category/domain/category.aggregate';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';

describe('GenreCategoryModel Integration Tests', () => {
  setupSequelize({ models: [CategoryModel, GenreModel, GenreCategoryModel] });

  test('table Name', () => {
    expect(GenreCategoryModel.tableName).toBe('category_genre');
  });

  test('mapping props', () => {
    const attributesMap = GenreCategoryModel.getAttributes();
    const attributes = Object.keys(GenreCategoryModel.getAttributes());
    expect(attributes).toStrictEqual(['genre_id', 'category_id']);

    const genreIdAttr = attributesMap.genre_id;
    expect(genreIdAttr).toMatchObject({
      field: 'genre_id',
      fieldName: 'genre_id',
      primaryKey: true,
      type: DataType.UUID(),
      references: {
        model: 'genres',
        key: 'genre_id',
      },
      unique: 'category_genre_genre_id_category_id_unique',
    });

    const categoryIdAttr = attributesMap.category_id;
    expect(categoryIdAttr).toMatchObject({
      field: 'category_id',
      fieldName: 'category_id',
      primaryKey: true,
      type: DataType.UUID(),
      references: {
        model: 'categories',
        key: 'category_id',
      },
      unique: 'category_genre_genre_id_category_id_unique',
    });
  });
});

describe('GenreModel Integration Tests', () => {
  setupSequelize({ models: [CategoryModel, GenreModel, GenreCategoryModel] });

  test('table name', () => {
    expect(GenreModel.tableName).toBe('genres');
  });

  test('mapping props', () => {
    const attributesMap = GenreModel.getAttributes();
    const attributes = Object.keys(GenreModel.getAttributes());
    expect(attributes).toStrictEqual([
      'genre_id',
      'name',
      'is_active',
      'created_at',
    ]);

    const genreIdAttr = attributesMap.genre_id;
    expect(genreIdAttr).toMatchObject({
      field: 'genre_id',
      fieldName: 'genre_id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const isActiveAttr = attributesMap.is_active;
    expect(isActiveAttr).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    const createdAtAttr = attributesMap.created_at;
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      allowNull: false,
      type: DataType.DATE(6),
    });
  });

  test('mapping associations', () => {
    const associontionsMap = GenreModel.associations;
    const associations = Object.keys(associontionsMap);
    expect(associations).toStrictEqual(['categories_id', 'categories']);

    const categoriesIdRelation = associontionsMap.categories_id;
    expect(categoriesIdRelation).toMatchObject({
      associationType: 'HasMany',
      source: GenreModel,
      target: GenreCategoryModel,
      options: {
        foreignKey: { name: 'genre_id' },
        as: 'categories_id',
      },
    });

    const categoriesRelation = associontionsMap.categories;
    expect(categoriesRelation).toMatchObject({
      associationType: 'BelongsToMany',
      source: GenreModel,
      target: CategoryModel,
      options: {
        through: { model: GenreCategoryModel },
        foreignKey: { name: 'genre_id' },
        otherKey: { name: 'category_id' },
        as: 'categories',
      },
    });
  });

  test('create and association relations separately', async () => {
    const categories = Category.fake().theCategories(3).build();
    const categoryRepo = new CategorySequelizeRepository(CategoryModel);
    await categoryRepo.bulkInsert(categories);

    const genreData = {
      genre_id: '93e5f1b7-4a3a-4a2a-8e5f-1b7a3a4a2a8e',
      name: 'Action',
      is_active: true,
      created_at: new Date(),
    };

    const genreModel = await GenreModel.create(genreData);
    await genreModel.$add('categories', [
      categories[0].category_id.id,
      categories[1].category_id.id,
      categories[2].category_id.id,
    ]);

    const genreWithCategories = await GenreModel.findByPk(genreModel.genre_id, {
      include: [
        {
          model: CategoryModel,
          attributes: ['category_id'],
        },
      ],
    });

    expect(genreWithCategories).toMatchObject(genreData);
    expect(genreWithCategories!.categories).toHaveLength(3);

    expect(genreWithCategories!.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category_id: categories[0].category_id.id }),
        expect.objectContaining({ category_id: categories[1].category_id.id }),
        expect.objectContaining({ category_id: categories[2].category_id.id }),
      ]),
    );

    const genreWithCategoriesId = await GenreModel.findByPk(
      genreModel.genre_id,
      {
        include: ['categories_id'],
      },
    );

    expect(genreWithCategoriesId!.categories_id).toHaveLength(3);
    expect(genreWithCategoriesId!.categories_id).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          genre_id: genreModel.genre_id,
          category_id: categories[0].category_id.id,
        }),
        expect.objectContaining({
          genre_id: genreModel.genre_id,
          category_id: categories[1].category_id.id,
        }),
        expect.objectContaining({
          genre_id: genreModel.genre_id,
          category_id: categories[2].category_id.id,
        }),
      ]),
    );
  });

  test('create with association in single transaction', async () => {
    const categories = Category.fake().theCategories(3).build();
    const categoryRepo = new CategorySequelizeRepository(CategoryModel);
    await categoryRepo.bulkInsert(categories);

    const genreModelData = {
      genre_id: '93e5f1b7-4a3a-4a2a-8e5f-1b7a3a4a2a8e',
      name: 'Action',
      is_active: true,
      categories_id: [
        GenreCategoryModel.build({
          category_id: categories[0].category_id.id,
          genre_id: '93e5f1b7-4a3a-4a2a-8e5f-1b7a3a4a2a8e',
        }),
        GenreCategoryModel.build({
          category_id: categories[1].category_id.id,
          genre_id: '93e5f1b7-4a3a-4a2a-8e5f-1b7a3a4a2a8e',
        }),
        GenreCategoryModel.build({
          category_id: categories[2].category_id.id,
          genre_id: '93e5f1b7-4a3a-4a2a-8e5f-1b7a3a4a2a8e',
        }),
      ],
      created_at: new Date(),
    };

    const genreModel = await GenreModel.create(genreModelData, {
      include: ['categories_id'],
    });

    const genreWithCategories = await GenreModel.findByPk(genreModel.genre_id, {
      include: [
        {
          model: CategoryModel,
          attributes: ['category_id'],
        },
      ],
    });

    const { categories_id, ...genreCommonProps } = genreModelData;
    expect(genreWithCategories).toMatchObject(genreCommonProps);
    expect(genreWithCategories!.categories).toHaveLength(3);

    expect(genreWithCategories!.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category_id: categories[0].category_id.id }),
        expect.objectContaining({ category_id: categories[1].category_id.id }),
        expect.objectContaining({ category_id: categories[2].category_id.id }),
      ]),
    );

    const genreWithCategoriesId = await GenreModel.findByPk(
      genreModel.genre_id,
      {
        include: ['categories_id'],
      },
    );

    expect(genreWithCategoriesId!.categories_id).toHaveLength(3);
    expect(genreWithCategoriesId!.categories_id).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          genre_id: genreModel.genre_id,
          category_id: categories[0].category_id.id,
        }),
        expect.objectContaining({
          genre_id: genreModel.genre_id,
          category_id: categories[1].category_id.id,
        }),
        expect.objectContaining({
          genre_id: genreModel.genre_id,
          category_id: categories[2].category_id.id,
        }),
      ]),
    );
  });
});
