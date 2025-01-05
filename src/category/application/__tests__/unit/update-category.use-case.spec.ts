import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../infra/db/in-memory/category-in-memory.repository";
import { UpdateCategoryUseCase } from "../../update-category.use-case";

describe("UpdateCategoyUseCase unit Tests", () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
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
  });
});
