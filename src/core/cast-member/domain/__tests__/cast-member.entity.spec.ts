import { CastMember, CastMemberId } from '../cast-member.aggregate';
import {
  CastMemberType,
  CastMemberTypes,
} from '../value-object/cast-member-type.vo';

describe('CastMember Unit Tests', () => {
  beforeEach(() => {
    CastMember.prototype.validate = jest
      .fn()
      .mockImplementation(CastMember.prototype.validate);
  });

  describe('constructor', () => {
    test('should create a actor cast member with default values', () => {
      const actor = CastMemberType.createActor();
      const castMemberActor = new CastMember({
        name: 'actor',
        cast_member_type: actor,
      });

      expect(castMemberActor.cast_member_id).toBeInstanceOf(CastMemberId);
      expect(castMemberActor.name).toBe('actor');
      expect(castMemberActor.member_type.type).toBe(CastMemberTypes.ACTOR);
      expect(castMemberActor.created_at).toBeInstanceOf(Date);
    });

    test('should create a director cast member with default values', () => {
      const director = CastMemberType.createDirector();
      const castMemberDirector = new CastMember({
        name: 'director',
        cast_member_type: director,
      });

      expect(castMemberDirector.cast_member_id).toBeInstanceOf(CastMemberId);
      expect(castMemberDirector.name).toBe('director');
      expect(castMemberDirector.member_type.type).toBe(
        CastMemberTypes.DIRECTOR,
      );
      expect(castMemberDirector.created_at).toBeInstanceOf(Date);
    });

    test('should create a cast member with all values', () => {
      const actor = CastMemberType.createActor();

      const createdAt = new Date();
      const castMember = new CastMember({
        name: 'member',
        cast_member_type: actor,
        created_at: createdAt,
      });

      expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
      expect(castMember.name).toBe('member');
      expect(castMember.member_type.type).toBe(CastMemberTypes.ACTOR);
      expect(castMember.created_at).toBe(createdAt);
    });
  });

  describe('create command', () => {
    test('should create a actor cast member', () => {
      const actor = CastMemberType.createActor();
      const castMemberActor = CastMember.create({
        name: 'actor',
        cast_member_type: actor,
      });

      expect(castMemberActor.cast_member_id).toBeInstanceOf(CastMemberId);
      expect(castMemberActor.name).toBe('actor');
      expect(castMemberActor.member_type.type).toBe(CastMemberTypes.ACTOR);
      expect(castMemberActor.created_at).toBeInstanceOf(Date);
      expect(CastMember.prototype.validate).toHaveBeenCalledTimes(1);
      expect(castMemberActor.notification.hasErrors()).toBe(false);
    });

    test('should create a director cast member', () => {
      const director = CastMemberType.createDirector();
      const castMemberDirector = CastMember.create({
        name: 'director',
        cast_member_type: director,
      });

      expect(castMemberDirector.cast_member_id).toBeInstanceOf(CastMemberId);
      expect(castMemberDirector.name).toBe('director');
      expect(castMemberDirector.member_type.type).toBe(
        CastMemberTypes.DIRECTOR,
      );
      expect(castMemberDirector.created_at).toBeInstanceOf(Date);
      expect(CastMember.prototype.validate).toHaveBeenCalledTimes(1);
      expect(castMemberDirector.notification.hasErrors()).toBe(false);
    });
  });

  describe('cast_member_id field', () => {
    const arrange = [
      { cast_member_id: null },
      { cast_member_id: undefined },
      { cast_member_id: new CastMemberId() },
    ];

    test.each(arrange)('id = %j', ({ cast_member_id }) => {
      const castMember = new CastMember({
        name: 'actor',
        cast_member_type: CastMemberType.createActor(),
        cast_member_id: cast_member_id as any,
      });
      expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
      if (cast_member_id instanceof CastMemberId) {
        expect(castMember.cast_member_id).toBe(cast_member_id);
      }
    });
  });

  test('should change Name', () => {
    const castMember = CastMember.create({
      name: 'John Don',
      cast_member_type: CastMemberType.createActor(),
    });

    castMember.changeName('John Doe');

    expect(castMember.name).toBe('John Doe');
    expect(CastMember.prototype.validate).toHaveBeenCalledTimes(2);
    expect(castMember.notification.hasErrors()).toBe(false);
  });

  test('should actor type cast member', () => {
    const castMember = CastMember.create({
      name: 'John Don',
      cast_member_type: CastMemberType.createActor(),
    });

    expect(castMember.member_type.type).toBe(CastMemberTypes.ACTOR);
    expect(castMember.notification.hasErrors()).toBe(false);
  });

  test('should director type cast member', () => {
    const castMember = CastMember.create({
      name: 'John Don',
      cast_member_type: CastMemberType.createDirector(),
    });

    expect(castMember.member_type.type).toBe(CastMemberTypes.DIRECTOR);
    expect(castMember.notification.hasErrors()).toBe(false);
  });
});

describe('CastMember Validator', () => {
  describe('create command', () => {
    test('should an invalid cast member with name property', () => {
      const castMember = CastMember.create({
        name: 'n'.repeat(256),
        cast_member_type: CastMemberType.createActor(),
      });

      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeName method', () => {
    test('should a invalid cast member with name property', () => {
      const castMember = CastMember.create({
        name: 'some name',
        cast_member_type: CastMemberType.createActor(),
      });

      castMember.changeName('n'.repeat(256));

      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
