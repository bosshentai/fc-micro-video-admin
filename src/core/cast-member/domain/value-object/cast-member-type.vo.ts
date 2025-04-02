import { Either } from '../../../shared/domain/either';
import { ValueObject } from '../../../shared/domain/value-object';

export enum CastMemberTypes {
  DIRECTOR = 1,
  ACTOR = 2,
}

export class CastMemberType extends ValueObject {
  constructor(readonly type: CastMemberTypes) {
    super();
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

  static create(
    type: CastMemberTypes,
  ): Either<CastMemberType, InvalidCastMemberTypeError> {
    return Either.safe(() => new CastMemberType(type));
  }

  static createDirector(): CastMemberType {
    return CastMemberType.create(CastMemberTypes.DIRECTOR).ok;
  }

  static createActor(): CastMemberType {
    return CastMemberType.create(CastMemberTypes.ACTOR).ok;
  }
}

export class InvalidCastMemberTypeError extends Error {
  constructor(invalidType: unknown) {
    super(`Invalid cast member type: ${invalidType}`);
    this.name = 'InvalidCastMemberTypeError';
  }
}
