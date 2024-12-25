import { Category } from "../../../../category/domain/category.entity";

describe("Category Unit Test", () => {
  // let validateSp: jest.SpyInstance;

  // beforeEach(() => {
  //   validateSpy = jest.spyOn(Category, "validate");
  // });

  describe("constructor", () => {
    test("should create a category with default values", () => {
      const category = new Category({
        name: "Movie",
      });
      expect(category.category_id).toBeDefined();
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should create a category with all the values", () => {
      const created_at = new Date();
      const category = new Category({
        name: "Movie",
        description: "Movie description",
        is_active: false,
        created_at,
      });

      expect(category.category_id).toBeDefined();
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBe(created_at);
    });

    test("should create a category with name and description", () => {
      const category = new Category({
        name: "Movie",
        description: "Movie description",
      });

      expect(category.category_id).toBeDefined();
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe("create command", () => {
    test("should create a category", () => {
      const category = Category.create({
        name: "Movie",
      });

      expect(category.category_id).toBeDefined();
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should create a category with description", () => {
      const category = Category.create({
        name: "Movie",
        description: "some description",
      });

      expect(category.category_id).toBeDefined();
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("some description");
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should create a category with is_active", () => {
      const category = Category.create({
        name: "Movie",
        is_active: false,
      });

      expect(category.category_id).toBeDefined();
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  // TODO - test do category_id

  describe("category_id field", () => {
    const arrange = [
      {
        category_id: null,
      },
      {
        category_id: undefined,
      },
      {
        category_id: new Uuid(),
      },
    ];

    test.each(arrange)("id = %j ", ({ category_id }) => {
      const category = new Category({
        name: "Movie",
        category_id: category_id as any,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      if (category_id instanceof Uuid) {
        expect(category.category_id).toBe(category_id);
      }
    });
  });

  test("should change name", () => {
    const category = new Category({
      name: "Movie",
    });

    category.changeName("other name");
    expect(category.name).toBe("other name");
  });

  test("should change description", () => {
    const category = new Category({
      name: "Movie",
    });

    category.changeDescription("some description");
    expect(category.description).toBe("some description");
  });

  test("should active a category", () => {
    const category = Category.create({
      name: "Movie",
      is_active: false,
    });

    category.activate();
    expect(category.is_active).toBeTruthy();
  });

  test("should disable a category", () => {
    const category = Category.create({
      name: "Movie",
      is_active: true,
    });

    category.deactivate();
    expect(category.is_active).toBeFalsy();
  });
});

describe("Category Validator", () => {
  describe("create Command", () => {
    test("should an invalida category with name property", () => {
      expect(() => Category.create({ name: null })).containsErrorMessage({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => Category.create({ name: "" })).containsErrorMessage({
        name: ["name should not be empty"],
      });

      expect(() => Category.create({ name: 5 as any })).containsErrorMessage({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() =>
        Category.create({ name: "t".repeat(256) })
      ).containsErrorMessage({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    test("should a invalid category using description property", () => {
      expect(() =>
        Category.create({ description: 5 } as any)
      ).containsErrorMessage({
        descripption: ["description must be a string"],
      });
    });

    test("should a invalid category using is_acting property", () => {
      expect(() => {
        Category.create({ is_ative: 5 } as any);
      }).containsErrorMessage({
        is_active: ["is_active must be a boolean value"],
      });
    });
  });

  describe("changeName method", () => {
    test("should a invalid category using name property", () => {
      const category = Category.create({ name: "Movie" });
      expect(() => category.changeName(null)).containsErrorMessage({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must shorter than or equal to 255 characters",
        ],
      });

      expect(() => category.changeName("")).containsErrorMessage({
        name: ["name should not be empty"],
      });

      expect(() => category.changeName(5 as any)).containsErrorMessage({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    });
  });

  describe("changeDescription method", () => {
    test("should a invalid category using description property", () => {
      const category = Category.create({ name: "Movie" });
      expect(() => category.changeDescription(5 as any)).containsErrorMessage({
        description: ["description must be a string"],
      });
    });
  });
});
