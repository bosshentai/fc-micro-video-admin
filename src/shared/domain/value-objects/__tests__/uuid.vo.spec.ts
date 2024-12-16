import { InvalidUuidError, Uuid } from "../uuid.vo";
import { validate as uuidValidate } from "uuid";

describe("Uuid Unit Test", () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, "validate");
  test("should throw error when uuid is invalid", () => {
    expect(() => {
      new Uuid("invalid-uuid");
    }).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should create a valid uuid", () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should accept a valid uuid", () => {
    const uuid = new Uuid("cf4a8b4b-4c3d-4d3c-8d4c-4c4d3c4d3c4d");
    expect(uuid.id).toBe("cf4a8b4b-4c3d-4d3c-8d4c-4c4d3c4d3c4d");
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
