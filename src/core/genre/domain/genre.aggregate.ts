import { CategoryId } from '@core/category/domain/category.aggregate';
import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { GenreValidatorFactory } from './genre.validator';
import { GenreFakeBuilder } from './genre-fake.builder';

export type GenreConstructorProps = {
  genre_id?: GenreId;
  name: string;
  categories_id: Map<string, CategoryId>;
  is_active?: boolean;
  created_at?: Date;
};

export type GenreCreatedCommand = {
  name: string;
  categories_id: CategoryId[];
  is_active?: boolean;
};

export class GenreId extends Uuid {}

export class Genre extends AggregateRoot {
  genre_id: GenreId;
  name: string;

  categories_id: Map<string, CategoryId>;

  is_active: boolean;
  created_at: Date;

  constructor(props: GenreConstructorProps) {
    super();
    this.genre_id = props.genre_id ?? new GenreId();
    this.name = props.name;
    this.categories_id = props.categories_id;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: GenreCreatedCommand): Genre {
    const genre = new Genre({
      name: props.name,
      categories_id: new Map(
        props.categories_id.map((category_id) => [category_id.id, category_id]),
      ),
      is_active: props.is_active,
    });

    genre.validate();
    return genre;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  addCategoryId(category_id: CategoryId): void {
    this.categories_id.set(category_id.id, category_id);
  }

  removeCategoryId(category_id: CategoryId): void {
    this.categories_id.delete(category_id.id);
  }

  syncCategoriesId(categories_id: CategoryId[]) {
    if (categories_id.length) {
      throw new Error('Categories id is empty');
      // return;
    }

    this.categories_id = new Map(
      categories_id.map((category_id) => [category_id.id, category_id]),
    );
  }

  active() {
    this.is_active = true;
  }

  deactivate() {
    this.is_active = false;
  }

  get entity_id() {
    return this.genre_id;
  }

  validate(fields?: string[]) {
    const validator = GenreValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return GenreFakeBuilder;
  }

  toJSON() {
    return {
      genre_id: this.genre_id.id,
      created_at: this.created_at,
      name: this.name,
      categories_id: Array.from(this.categories_id.values()).map(
        (categories_id) => categories_id.id,
      ),
      is_active: this.is_active,
    };
  }
}
