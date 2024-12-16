import { AggregateRoot } from "../../shared/domain/aggregate-root";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { ValidatorRules } from "../../shared/domain/validator/validator-rules";
import { CategoryValidatorFactory } from "./category.validator";
import { ValueObject } from "../../shared/domain/value-object";
import { EntityValidationError } from "../../shared/domain/validator/validation.error";

export type CategoryConstructorProps = {
  category_id?: Uuid;
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

export class Category extends AggregateRoot {
  category_id: Uuid;
  name: string;

  description: string | null;

  is_active: boolean;

  created_at: Date;

  constructor(props: CategoryConstructorProps) {
    super();
    this.category_id = props.category_id ?? new Uuid();
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  // factory
  static create(props: CategoryCreatedCommand): Category {
    const category = new Category(props);
    Category.validate(category);
    // good for events

    return category;
  }

  changeName(name: string): void {
    // ValidatorRules.values(name, "name").required().string().maxLength(255);
    this.name = name;
    Category.validate(this);
  }

  changeDescription(description: string): void {
    this.description = description;
    Category.validate(this);
    // this.validate(["description"]);
  }

  activate() {
    this.is_active = true;
  }

  deactivate() {
    this.is_active = false;
  }

  get entity_id(): ValueObject {
    throw new Error("Method not implemented.");
  }

  static validate(entity?: Category) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(entity);

    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
    // return validator.validate(this.notification, this, fields);
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
