// import * as CategorySequelize from "../category-sequelize.repository";

import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { EntityValidationError } from "../../../../../shared/domain/validator/validation.error";
import { CategoryModelMapper } from "../category-model-mapper";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";

// const { CategoryModel, CategotyModelMapper } = CategorySequelize;

describe("CategoryModelMapper Integration Tests", () => {
  let sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [CategoryModel],
    });

    await sequelize.sync({ force: true });
  });

  it("should throws error when category is invalid", () => {
    const model = CategoryModel.build({
      category_id: "d5b0f725-5c47-4b39-8af5-2c6c8d2824f3",
    });

    try {
      CategoryModelMapper.toEntity(model);
      fail(
        "The category is valid, but it needs throws a EntityValidationError"
      );
    } catch (error) {
      expect(error).toBeInstanceOf(EntityValidationError);
      expect((error as EntityValidationError).error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should convert a category model to a category entity", () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      category_id: "d5b0f725-5c47-4b39-8af5-2c6c8d2824f3",
      name: "Movie",
      description: "Movie description",
      is_active: true,
      created_at,
    });

    const entity = CategoryModelMapper.toEntity(model);

    expect(entity.toJSON()).toStrictEqual(
      new Category({
        category_id: new Uuid("d5b0f725-5c47-4b39-8af5-2c6c8d2824f3"),
        name: "Movie",
        description: "Movie description",
        is_active: true,
        created_at,
      }).toJSON()
    );
  });

  it("shoudl convert  category entity to a category model", () => {
    const created_at = new Date();
    const entity = new Category({
      category_id: new Uuid("d5b0f725-5c47-4b39-8af5-2c6c8d2824f3"),
      name: "Movie",
      description: "Movie description",
      is_active: true,
      created_at,
    });
    const model = CategoryModelMapper.toModel(entity);
    expect(model.toJSON()).toStrictEqual({
      category_id: "d5b0f725-5c47-4b39-8af5-2c6c8d2824f3",
      name: "Movie",
      description: "Movie description",
      is_active: true,
      created_at,
    });
  });
});
