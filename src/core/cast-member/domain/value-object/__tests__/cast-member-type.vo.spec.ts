import { CastMemberType, CastMemberTypes } from '../cast-member-type.vo';

describe('CastMemberType Unit Test', () => {
  const validateSpy = jest.spyOn(CastMemberType.prototype as any, 'validate');

  test('Throw error when the cast member type is invalid', () => {
    expect(() => {
      new CastMemberType(3 as any);
    }).toThrow(new Error('Invalid cast member type 3'));
    expect(validateSpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  // create actor

  test('it should create a actor cast member type', () => {
    const actorMember = CastMemberType.create(CastMemberTypes.ACTOR);
    expect(actorMember).toBeInstanceOf(CastMemberType);
    expect(actorMember.type).toBe(CastMemberTypes.ACTOR);
  });

  test('it should create a director cast member type', () => {
    const directorMember = CastMemberType.create(CastMemberTypes.DIRECTOR);
    expect(directorMember).toBeInstanceOf(CastMemberType);
    expect(directorMember.type).toBe(CastMemberTypes.DIRECTOR);
  });
});
