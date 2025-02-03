import { CastMember } from './cast-member.entity';
import { ClassValidatorFields } from '../../shared/domain/validator/class-validator-fields';
import { Notification } from '../../shared/domain/validator/notification';
import { MaxLength } from 'class-validator';

export class CastMemberRules {
  @MaxLength(255, { groups: ['name'] })
  name: string;

  constructor(entity: CastMember) {
    Object.assign(this, entity);
  }
}

export class CastMemberValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: CastMember,
    fields?: string[],
  ): boolean {
    const newFields = fields?.length ? fields : ['name'];
    return super.validate(notification, new CastMemberRules(data), newFields);
  }
}

export class CastMemberValidatorFactory {
  static create() {
    return new CastMemberValidator();
  }
}
