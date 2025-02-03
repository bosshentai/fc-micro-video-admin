import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { CastMember } from './cast-member.entity';
import { Chance } from 'chance';
import {
  CastMemberType,
  CastMemberTypes,
} from './value-object/cast-member-type.vo';

type PropOrFactory<T> = T | ((index: number) => T);

export class CastMemberFakeBuilder<TBuild extends CastMember | CastMember[]> {
  private chance: Chance.Chance;

  private _cast_member_id: PropOrFactory<Uuid> | undefined = undefined;

  private _name: PropOrFactory<string> = (_index) => this.chance.word();

  private _member_type: PropOrFactory<CastMemberType> = (_index) =>
    new CastMemberType(
      this.chance.pickone([CastMemberTypes.DIRECTOR, CastMemberTypes.ACTOR]),
    );
  private _created_at: PropOrFactory<Date> | undefined = undefined;

  private countObjs: number;

  static aCastMember(): CastMemberFakeBuilder<CastMember> {
    return new CastMemberFakeBuilder<CastMember>();
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

  withUuid(valueOrFactory: PropOrFactory<Uuid>) {
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

  private getValue<T>(prop: unknown): T {
    const optional = ['cast_member_id', 'created_at'];
    const privateProps = `_${prop}` as keyof this;
    if (!this[privateProps] && optional.includes(prop as string)) {
      throw new Error(`Property ${prop} not have factory, use 'with' methods`);
    }
    return this.callFactory(this[privateProps] as PropOrFactory<T>, 0);
  }

  get cast_member_id(): Uuid {
    return this.getValue<Uuid>('cast_member_id');
  }

  get name(): string {
    return this.getValue<string>('name');
  }

  get member_type() {
    return this.getValue('member_type');
  }

  get created_at() {
    return this.getValue('created_at');
  }

  build() {
    const castMembers = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const castMember = new CastMember({
          cast_member_id: !this._cast_member_id
            ? undefined
            : this.callFactory(this._cast_member_id, index),
          name: this.callFactory(this._name, index),
          type: this.callFactory(this._member_type, index),
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
