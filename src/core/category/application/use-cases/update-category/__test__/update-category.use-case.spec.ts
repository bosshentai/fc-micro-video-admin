import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { UpdateCategoryUseCase } from "../update-category.use-case";

describe("UpdateCategoyUseCase unit Tests", () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  it("should throws an error when entity is not valid", async () => {
    const entity = new Category({ name: "Movie" });
    repository.items = [entity];
    await expect(() =>
      useCase.execute({
        id: entity.category_id.id,
        name: "t".repeat(256),
      })
    ).rejects.toThrow("Entity Validation Error");
  });

  it("should throws error when entity not found", async () => {
    try {
      await useCase.execute({ id: "fake id", name: "new name" });
      throw new Error("Expected method to throw, but it did not.");
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidUuidError);
    }

    const uuid = new Uuid();

    try {
      await useCase.execute({ id: uuid.id, name: "fake" });
      throw new Error("Expected useCase.execute to throw, but it did not.");
    } catch (error) {
      const errors = error as Error;
      expect(errors).toBeInstanceOf(NotFoundError);
      expect(errors.message).toContain(uuid.id);
      expect(errors.message).toContain(Category.name);
    }
  });

  it("should update a category", async () => {
    const spyUpdate = jest.spyOn(repository, "update");
    const entity = new Category({ name: "Movie" });
    repository.items = [entity];

    let output = await useCase.execute({
      id: entity.category_id.id,
      name: "test",
    });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: "test",
      description: null,
      is_active: true,
      created_at: entity.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: null | string;
        is_active?: boolean;
      };
      expected: {
        id: string;
        name: string;
        description: null | string;
        is_active: boolean;
        created_at: Date;
      };
    };

    const arrange: Arrange[] = [
      {
        input: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
          is_active: false,
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
          is_active: true,
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: false,
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: false,
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...("name" in i.input && { name: i.input.name }),
        ...("description" in i.input && { description: i.input.description }),
        ...("is_active" in i.input && { is_active: i.input.is_active }),
      });

      expect(output).toStrictEqual({
        id: entity.category_id.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: entity.created_at,
      });
    }
  });
});
