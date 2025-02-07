import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { CastMemberFakeBuilder } from '../cast-member-fake.builder';
import { CastMember } from '../cast-member.entity';
import { Chance } from 'chance';
import {
  CastMemberType,
  CastMemberTypes,
} from '../value-object/cast-member-type.vo';
describe('CastMemberFakeBuilder Unit Tests', () => {
  describe('cast_member_id prop', () => {
    const faker = CastMemberFakeBuilder.anActor();

    test('should throw error when any with methods has called', () => {
      expect(() => faker.cast_member_id).toThrow(
        new Error(
          "Property cast_member_id not have factory, use 'with' methods",
        ),
      );
    });

    test('should be undefined', () => {
      expect(faker['_cast_member_id']).toBeUndefined();
    });

    test('withUuid', () => {
      const cast_member_id = new Uuid();
      const $this = faker.withUuid(cast_member_id);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_cast_member_id']).toBe(cast_member_id);

      faker.withUuid(() => cast_member_id);

      if (typeof faker['_cast_member_id'] === 'function') {
        expect(faker['_cast_member_id'](0)).toBe(cast_member_id);
      }

      expect(faker.cast_member_id).toBe(cast_member_id);
    });

    test('should pass index to cast_member_id factory', () => {
      let mockFactory = jest.fn(() => new Uuid());
      faker.withUuid(mockFactory);
      faker.build();

      expect(mockFactory).toHaveBeenCalledTimes(1);

      const castMemberId = new Uuid();

      mockFactory = jest.fn(() => castMemberId);

      const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
      fakerMany.withUuid(mockFactory);
      fakerMany.build();
      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect((fakerMany.build() as CastMember[])[0].cast_member_id).toBe(
        castMemberId,
      );

      expect((fakerMany.build() as CastMember[])[1].cast_member_id).toBe(
        castMemberId,
      );
    });
  });

  describe('name prop', () => {
    const faker = CastMemberFakeBuilder.anActor();

    test('should be a function', () => {
      expect(typeof faker['_name']).toBe('function');
    });

    test('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();
      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withName ', () => {
      const $this = faker.withName('test name');
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_name']).toBe('test name');
    });

    test('should pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`);
      const castMember = faker.build() as CastMember;

      expect(castMember.name).toBe('test name 0');

      const fakeMany = CastMemberFakeBuilder.theCastMembers(2);
      fakeMany.withName((index) => `test name ${index}`);
      const castMembers = fakeMany.build() as CastMember[];

      expect(castMembers[0].name).toBe('test name 0');
      expect(castMembers[1].name).toBe('test name 1');
    });

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_name'].length).toBe(256);

      const tooLong = 't'.repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker['_name']).toBe(tooLong);
      expect(faker['_name'].length).toBe(256);
    });
  });

  describe('member_type prop', () => {
    const faker = CastMemberFakeBuilder.anActor();

    it('should be a CastMemberType', () => {
      expect(faker['_member_type']).toBeInstanceOf(CastMemberType);
    });

    test('withMemberType', () => {
      let member = CastMemberType.createActor();
      let $this = faker.withMemberType(member);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_member_type']).toBe(member);

      member = CastMemberType.createDirector();
      $this = faker.withMemberType(member);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_member_type']).toBe(member);
    });
  });
});
