import { Entity } from '../entity';
import { ValueObject } from '../value-object';

class ClassValueObject extends ValueObject {
  constructor(private readonly id: string) {
    super();
  }

  toString(): string {
    return this.id;
  }
}

// Concrete implementation of Entity for testing
class TestEntity extends Entity {
  private readonly _entity_id: ClassValueObject;

  constructor(id: string) {
    super();
    this._entity_id = new ClassValueObject(id);
  }

  get entity_id(): ValueObject {
    return this._entity_id;
  }

  toJSON(): any {
    return { id: this._entity_id.toString() };
  }
}

describe('Entity Unit Test', () => {
  test('should return ValueObject as entity_id', () => {
    const id = '1';
    const entity = new TestEntity(id);

    expect(entity.entity_id.toString()).toBe(id);
  });

  it('should return a valid JSON ', () => {
    const id = '1';
    const entity = new TestEntity(id);
    expect(entity.toJSON()).toStrictEqual({ id });
  });
});
