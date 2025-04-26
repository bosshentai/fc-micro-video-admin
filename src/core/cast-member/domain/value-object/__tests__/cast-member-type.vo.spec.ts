import { CastMemberType, CastMemberTypes } from '../cast-member-type.vo';

describe('CastMemberType Unit Test', () => {
  const validateSpy = jest.spyOn(CastMemberType.prototype as any, 'validate');

  test('Throw error when the cast member type is invalid', () => {
    expect(() => {
      new CastMemberType('1' as any);
    }).toThrow(new Error('Invalid cast member type: 1'));
    expect(validateSpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test('should create a actor cast member type', () => {
    const actorMember = CastMemberType.createActor();
    expect(actorMember).toBeInstanceOf(CastMemberType);
    expect(actorMember.type).toBe(CastMemberTypes.ACTOR);

    const [actorMember2, error] = CastMemberType.create(
      CastMemberTypes.ACTOR,
    ).asArray();
    expect(error).toBeUndefined();
    expect(actorMember2).toBeInstanceOf(CastMemberType);
    expect(actorMember2.type).toBe(CastMemberTypes.ACTOR);
  });

  test('should create a director cast member type', () => {
    const directorMember = CastMemberType.createDirector();
    expect(directorMember).toBeInstanceOf(CastMemberType);
    expect(directorMember.type).toBe(CastMemberTypes.DIRECTOR);

    const [directorMember2, error] = CastMemberType.create(
      CastMemberTypes.DIRECTOR,
    ).asArray();
    expect(error).toBeUndefined();
    expect(directorMember2).toBeInstanceOf(CastMemberType);
    expect(directorMember2.type).toBe(CastMemberTypes.DIRECTOR);
  });
});
