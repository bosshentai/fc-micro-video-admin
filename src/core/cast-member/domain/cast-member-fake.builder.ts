import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { Chance } from 'chance';
import { CastMemberType } from './value-object/cast-member-type.vo';
import { CastMember, CastMemberId } from './cast-member.aggregate';

type PropOrFactory<T> = ((index: number) => T) | T;

export class CastMemberFakeBuilder<TBuild = CastMember | CastMember[]> {
  private chance: Chance.Chance;

  private _cast_member_id: PropOrFactory<CastMemberId> | undefined = undefined;

  private _name: PropOrFactory<string> = (_index) => this.chance.word();

  private _member_type: PropOrFactory<CastMemberType> = (_index) =>
    CastMemberType.createActor();

  private _created_at: PropOrFactory<Date> | undefined = undefined;

  private countObjs: number;

  static aDirector() {
    return new CastMemberFakeBuilder<CastMember>().withMemberType(
      CastMemberType.createDirector(),
    );
  }

  static anActor() {
    return new CastMemberFakeBuilder<CastMember>().withMemberType(
      CastMemberType.createActor(),
    );
  }

  static theActors(countObjs: number) {
    return new CastMemberFakeBuilder<CastMember[]>(countObjs).withMemberType(
      CastMemberType.createActor(),
    );
  }

  static theDirectors(countObjs: number) {
    return new CastMemberFakeBuilder<CastMember[]>(countObjs).withMemberType(
      CastMemberType.createDirector(),
    );
  }

  static theCastMembers(
    countObjs: number,
  ): CastMemberFakeBuilder<CastMember[]> {
    return new CastMemberFakeBuilder<CastMember[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = new Chance();
  }

  withUuid(valueOrFactory: PropOrFactory<CastMemberId>) {
    this._cast_member_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withMemberType(valueOrFactory: PropOrFactory<CastMemberType>) {
    this._member_type = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  private callFactory<T>(factoryOrValue: PropOrFactory<T>, index: number): T {
    return typeof factoryOrValue === 'function'
      ? (factoryOrValue as (index: number) => T)(index)
      : factoryOrValue;
  }

  private getValue<T>(prop: string): T {
    const optional = ['cast_member_id', 'created_at'];
    const privateProps = `_${prop}` as keyof this;
    if (!this[privateProps] && optional.includes(prop)) {
      throw new Error(`Property ${prop} not have factory, use 'with' methods`);
    }
    return this.callFactory(this[privateProps], 0) as T;
  }

  get cast_member_id(): CastMemberId {
    return this.getValue<Uuid>('cast_member_id');
  }

  get name(): string {
    return this.getValue<string>('name');
  }

  get member_type(): CastMemberType {
    return this.getValue<CastMemberType>('member_type');
  }

  get created_at(): Date {
    return this.getValue<Date>('created_at');
  }

  build(): TBuild {
    const castMembers = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const castMember = new CastMember({
          cast_member_id: !this._cast_member_id
            ? undefined
            : this.callFactory(this._cast_member_id, index),
          name: this.callFactory(this._name, index),
          cast_member_type: this.callFactory(this._member_type, index),
          ...(this._created_at && {
            created_at: this.callFactory(this._created_at, index),
          }),
        });
        castMember.validate();
        return castMember;
      });
    return this.countObjs === 1
      ? (castMembers[0] as TBuild)
      : (castMembers as TBuild);
  }
}
