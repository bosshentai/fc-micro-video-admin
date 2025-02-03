import { ValueObject } from '@core/shared/domain/value-object';

export enum CastMemberTypes {
  DIRECTOR = 1,
  ACTOR = 2,
}

export class CastMemberType extends ValueObject {
  readonly type: CastMemberTypes;
  constructor(castMemberType: CastMemberTypes) {
    super();

    this.type = castMemberType;
    this.validate();
  }

  private validate() {
    const isValid =
      this.type === CastMemberTypes.DIRECTOR ||
      this.type === CastMemberTypes.ACTOR;

    if (!isValid) {
      throw new InvalidCastMemberTypeError(this.type);
    }
  }

  static create(type: CastMemberTypes): CastMemberType {
    return new CastMemberType(type);
  }

  static createDirector(): CastMemberType {
    return CastMemberType.create(CastMemberTypes.DIRECTOR);
  }

  static createActor(): CastMemberType {
    return CastMemberType.create(CastMemberTypes.ACTOR);
  }
}

export class InvalidCastMemberTypeError extends Error {
  constructor(invalidType?: unknown) {
    super(`Invalid cast member type ${invalidType}`);
    this.name = 'InvalidCastMemberTypeError';
  }
}
