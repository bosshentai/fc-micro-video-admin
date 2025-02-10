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

  // it('should filter by type', async () => {
  //   const faker = CastMember.fake();

  //   const items = [faker.aDirector().build(), faker.anActor().build()];

  //   const filterSpy = jest.spyOn(items, 'filter' as any);
  //   const itemsFiltered = await repository['applyFilter'](items, {
  //     type: CastMemberType.createDirector(),
  //   });

  //   expect(filterSpy).toHaveBeenCalledTimes(1);
  //   expect(itemsFiltered).toStrictEqual([items[0]]);
  // });
});
