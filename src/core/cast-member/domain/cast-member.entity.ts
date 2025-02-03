import { ValueObject } from '../../shared/domain/value-object';
import { Entity } from '../..//shared/domain/entity';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { CastMemberType } from './value-object/cast-member-type.vo';
import { CastMemberValidatorFactory } from './cast-member.validator';

export type CastMemberConstructorProps = {
  cast_member_id?: Uuid;
  name: string;
  type: CastMemberType;
  created_at?: Date;
};

export type CastMemberCreatedCommand = {
  name: string;
  type: CastMemberType;
};

export class CastMember extends Entity {
  cast_member_id: Uuid;

  name: string;

  member_type: CastMemberType;

  created_at: Date;

  constructor(props: CastMemberConstructorProps) {
    super();
    this.cast_member_id = props.cast_member_id ?? new Uuid();
    this.name = props.name;
    this.member_type = props.type;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: CastMemberCreatedCommand): CastMember {
    const castMember = new CastMember(props);
    castMember.validate(['name']);

    return castMember;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  validate(fields?: string[]) {
    const validator = CastMemberValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  get entity_id(): ValueObject {
    return this.cast_member_id;
  }
  toJSON() {
    return {
      cast_member_id: this.cast_member_id.id,
      type: this.member_type,
      created_at: this.created_at,
    };
  }
}
