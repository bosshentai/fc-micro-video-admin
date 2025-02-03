import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { CategoryFakeBuilder } from '../category-fake.builder';
import { Category } from '../category.entity';
import { Chance } from 'chance';
describe('CategoryFakeBuilder Unit Tests', () => {
  describe('category_id prop', () => {
    const faker = CategoryFakeBuilder.aCategory();

    test('should throw error when any with methods has called', () => {
      expect(() => faker.category_id).toThrow(
        new Error("Property category_id not have factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_category_id']).toBeUndefined();
    });

    test('withUuid', () => {
      const category_id = new Uuid();
      const $this = faker.withUuid(category_id);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_category_id']).toBe(category_id);

      faker.withUuid(() => category_id);

      if (typeof faker['_category_id'] === 'function') {
        expect(faker['_category_id'](0)).toBe(category_id);
      }

      expect(faker.category_id).toBe(category_id);
    });

    test('should pass index to category_id factory', () => {
      let mockFactory = jest.fn(() => new Uuid());
      faker.withUuid(mockFactory);
      faker.build();

      expect(mockFactory).toHaveBeenCalledTimes(1);

      const categoryId = new Uuid();

      mockFactory = jest.fn(() => categoryId);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withUuid(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);

      expect((fakerMany.build() as Category[])[0].category_id).toBe(categoryId);
      expect((fakerMany.build() as Category[])[1].category_id).toBe(categoryId);
    });
  });

  describe('name prop', () => {
    const faker = CategoryFakeBuilder.aCategory();

    test('should be a function', () => {
      expect(typeof faker['_name']).toBe('function');
    });

    test('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();
      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withName', () => {
      const $this = faker.withName('test name');
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_name']).toBe('test name');
    });

    test('should pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`);
      const category = faker.build() as Category;

      expect(category.name).toBe('test name 0');

      const fakeMany = CategoryFakeBuilder.theCategories(2);
      fakeMany.withName((index) => `test name ${index}`);
      const categories = fakeMany.build() as Category[];

      expect(categories[0].name).toBe('test name 0');
      expect(categories[1].name).toBe('test name 1');
    });

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_name'].length).toBe(256);

      const tooLong = 'a'.repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker['_name']).toBe(tooLong);
      expect(faker['_name'].length).toBe(256);
    });
  });

  describe('desription prop', () => {
    const faker = CategoryFakeBuilder.aCategory();

    test('should be a function', () => {
      expect(typeof faker['_description']).toBe('function');
    });

    test('should call the paragraph method', () => {
      const chance = Chance();
      const spyParagraphMethod = jest.spyOn(chance, 'paragraph');
      faker['chance'] = chance;
      faker.build();
      expect(spyParagraphMethod).toHaveBeenCalled();
    });

    test('withDescription', () => {
      const $this = faker.withDescription('test description');
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_description']).toBe('test description');

      faker.withDescription(() => 'test description');

      if (typeof faker['_description'] === 'function') {
        expect(faker['_description'](0)).toBe('test description');
      }

      expect(faker.description).toBe('test description');
    });

    test('should pass index to description factory', () => {
      faker.withDescription((index) => `test description ${index}`);
      const category = faker.build();
      expect(category.description).toBe('test description 0');

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withDescription((index) => `test description ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].description).toBe('test description 0');
      expect(categories[1].description).toBe('test description 1');
    });
  });

  describe('is_active prop', () => {
    const faker = CategoryFakeBuilder.aCategory();

    test('should be a function', () => {
      expect(typeof faker['_is_active']).toBe('function');
    });

    test('activate', () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_is_active']).toBe(true);
      expect(faker.is_active).toBe(true);
    });

    test('deactivate', () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_is_active']).toBe(false);
      expect(faker.is_active).toBe(false);
    });
  });

  describe('created_at prop', () => {
    const faker = CategoryFakeBuilder.aCategory();

    test('should throw error when any whth methods has called', () => {
      const fakerCategory = CategoryFakeBuilder.aCategory();
      expect(() => fakerCategory.created_at).toThrow(
        new Error("Property created_at not have factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_created_at']).toBeUndefined();
    });

    test('withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_created_at']).toBe(date);

      faker.withCreatedAt(() => date);
      if (typeof faker['_created_at'] === 'function') {
        expect(faker['_created_at'](0)).toBe(date);
      }
      expect(faker.created_at).toBe(date);
    });

    test('should pass index to created_at factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));

      const category = faker.build();
      expect(category.created_at.getTime()).toBe(date.getTime() + 2);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();

      expect(categories[0].created_at.getTime()).toBe(date.getTime() + 2);
      expect(categories[1].created_at.getTime()).toBe(date.getTime() + 3);
    });
  });

  test('should create a category', () => {
    const faker = CategoryFakeBuilder.aCategory();
    let category = faker.build();
    expect(category).toBeInstanceOf(Category);
    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(typeof category.name === 'string').toBeTruthy();
    expect(typeof category.description === 'string').toBeTruthy();
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);

    const create_at = new Date();
    const category_id = new Uuid();
    category = faker
      .withUuid(category_id)
      .withName('name test')
      .withDescription('descrption test')
      .withCreatedAt(create_at)
      .build();

    expect(category.category_id.id).toBe(category_id.id);
    expect(category.name).toBe('name test');
    expect(category.description).toBe('descrption test');
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBe(create_at);
  });

  test('should creae many categories', () => {
    const faker = CategoryFakeBuilder.theCategories(2);
    let categories = faker.build();

    categories.forEach((categories) => {
      expect(categories.category_id).toBeInstanceOf(Uuid);
      expect(typeof categories.name === 'string').toBeTruthy();
      expect(typeof categories.description === 'string').toBeTruthy();
      expect(categories.is_active).toBe(true);
      expect(categories.created_at).toBeInstanceOf(Date);
    });

    const created_at = new Date();
    const category_id = new Uuid();

    categories = faker
      .withUuid(category_id)
      .withName('name test')
      .withDescription('descrption test')
      .deactivate()
      .withCreatedAt(created_at)
      .build();

    categories.forEach((category) => {
      expect(category.category_id.id).toBe(category_id.id);
      expect(category.name).toBe('name test');
      expect(category.description).toBe('descrption test');
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBe(created_at);
    });
  });
});
