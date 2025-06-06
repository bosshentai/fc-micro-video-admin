import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { CategoryValidatorFactory } from './category.validator';
import { CategoryFakeBuilder } from './category-fake.builder';
import { AggregateRoot } from '@core/shared/domain/aggregate-root';

export type CategoryConstructorProps = {
  category_id?: CategoryId;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
};

export type CategoryCreatedCommand = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export class CategoryId extends Uuid {}

export class Category extends AggregateRoot {
  category_id: CategoryId;
  name: string;

  description: string | null;

  is_active: boolean;

  created_at: Date;

  constructor(props: CategoryConstructorProps) {
    super();
    this.category_id = props.category_id ?? new CategoryId();
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  // factory
  static create(props: CategoryCreatedCommand): Category {
    const category = new Category(props);

    category.validate(['name']);
    return category;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  changeDescription(description: string | null): void {
    this.description = description;
  }

  activate() {
    this.is_active = true;
  }

  deactivate() {
    this.is_active = false;
  }

  get entity_id() {
    return this.category_id;
  }

  validate(fields?: string[]) {
    const validator = CategoryValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return CategoryFakeBuilder;
  }

  toJSON() {
    return {
      category_id: this.category_id.id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
