import { MaxLength } from 'class-validator';
import { Category } from './category.entity';
import { ClassValidatorFields } from '../../shared/domain/validator/class-validator-fields';
import { Notification } from '../../shared/domain/validator/notification';

// domain validation vs syntax validation

export class CategoryRules {
  @MaxLength(255, { groups: ['name'] }) // domain validation
  name: string;

  constructor(entity: Category) {
    Object.assign(this, entity);
  }
}

export class CategoryValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Category,
    fields?: string[],
  ): boolean {
    const newFields = fields?.length ? fields : ['name'];

    return super.validate(notification, new CategoryRules(data), newFields);
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
