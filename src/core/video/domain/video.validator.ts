import { MaxLength } from 'class-validator';
import { Video } from './video.aggregate';
import { ClassValidatorFields } from '@core/shared/domain/validator/class-validator-fields';
import { Notification } from '@core/shared/domain/validator/notification';
export class VideoRules {
  @MaxLength(255, { groups: ['title'] })
  title: string;

  constructor(aggregado: Video) {
    Object.assign(this, aggregado);
  }
}

export class VideoValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Video,
    fields?: string[],
  ): boolean {
    const newFields = fields?.length ? fields : ['title'];
    return super.validate(notification, new VideoRules(data), newFields);
  }
}

export class VideoValidatorFactory {
  static create() {
    return new VideoValidator();
  }
}
