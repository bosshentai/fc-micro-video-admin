import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { CastMemberModel } from './cast-member.model';
import { CastMemberType } from '@core/cast-member/domain/value-object/cast-member-type.vo';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { EntityValidationError } from '@core/shared/domain/validator/validation.error';

export class CastMemberModelMapper {
  static toEntity(model: CastMemberModel): CastMember {
    const { cast_member_id: id, ...otherData } = model.toJSON();

    const [type, errorCastMemberType] = CastMemberType.create(
      otherData.type,
    ).asArray();

    const castMember = new CastMember({
      ...otherData,
      cast_member_id: new Uuid(id),
      cast_member_type: type,
    });

    castMember.validate();
    const notification = castMember.notification;

    if (errorCastMemberType) {
      notification.setError(errorCastMemberType.message, 'type');
    }

    if (notification.hasErrors()) {
      throw new EntityValidationError(notification.toJSON());
    }

    return castMember;
  }
}
