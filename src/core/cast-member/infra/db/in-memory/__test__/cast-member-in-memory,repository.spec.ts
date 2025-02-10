import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { CastMemberInMemoryRepository } from '../cast-member-in-memory.repository';
import { CastMemberType } from '@core/cast-member/domain/value-object/cast-member-type.vo';

describe('CastMemberIdInMemoryRepository Unit Tests', () => {
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => (repository = new CastMemberInMemoryRepository()));

  it('should no filter items when filter object is null', async () => {
    const items = [
      CastMember.fake().aDirector().build(),
      CastMember.fake().anActor().build(),
    ];

    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it('should filter by name', async () => {
    const faker = CastMember.fake().anActor();

    const items = [
      faker.withName('test').build(),
      faker.withName('TEST').build(),
      faker.withName('fake').build(),
    ];

    const filterSpy = jest.spyOn(items, 'filter' as any);
    const itemsFiltered = await repository['applyFilter'](items, {
      name: 'TEST',
    });
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it('should filter by type', async () => {
    const faker = CastMember.fake();

    const items = [faker.aDirector().build(), faker.anActor().build()];

    const filterSpy = jest.spyOn(items, 'filter' as any);
    let itemsFiltered = await repository['applyFilter'](items, {
      type: CastMemberType.createDirector(),
    });

    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0]]);

    itemsFiltered = await repository['applyFilter'](items, {
      type: CastMemberType.createActor(),
    });

    expect(filterSpy).toHaveBeenCalledTimes(2);
    expect(itemsFiltered).toStrictEqual([items[1]]);
  });

  it('should filter items by name and type', async () => {
    const items = [
      CastMember.fake().anActor().withName('test').build(),
      CastMember.fake().anActor().withName('fake').build(),
      CastMember.fake().aDirector().build(),
      CastMember.fake().aDirector().withName('test fake').build(),
    ];

    const itemsFiltered = await repository['applyFilter'](items, {
      name: 'test',
      type: CastMemberType.createActor(),
    });

    expect(itemsFiltered).toStrictEqual([items[0]]);
  });

  it('should sort by created_at when sort para is null', async () => {
    const items = [
      CastMember.fake()
        .anActor()
        .withName('test')
        .withCreatedAt(new Date())
        .build(),
      CastMember.fake()
        .anActor()
        .withName('TEST')
        .withCreatedAt(new Date(new Date().getTime() + 100))
        .build(),
      CastMember.fake()
        .anActor()
        .withName('fake')
        .withCreatedAt(new Date(new Date().getTime() + 200))
        .build(),
    ];

    const itemsSorted = await repository['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });
});
