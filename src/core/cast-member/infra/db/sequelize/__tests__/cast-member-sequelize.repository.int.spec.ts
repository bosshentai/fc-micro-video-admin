import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { CastMemberModel } from '../cast-member.model';
import { CastMemberSequelizeRepository } from '../cast-member-sequelize';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { CastMemberModelMapper } from '../cast-member.mapper';
import {
  CastMemberSearchParams,
  CastMemberSearchResult,
} from '@core/cast-member/domain/cast-member.repository';
import { CastMemberTypes } from '@core/cast-member/domain/value-object/cast-member-type.vo';
import orderBy from 'lodash/orderBy';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';

describe('CastMemberSequelizeRepository Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });
  let repository: CastMemberSequelizeRepository;

  beforeEach(async () => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
  });

  it('should inserts a new entity', async () => {
    const castMember = CastMember.fake().anActor().build();
    await repository.insert(castMember);
    const castMemberCreated = await repository.findById(
      castMember.cast_member_id,
    );

    expect(castMemberCreated!.toJSON()).toStrictEqual(castMember.toJSON());
  });

  it('should finds a entity by id', async () => {
    let entityFound = await repository.findById(new Uuid());
    expect(entityFound).toBeNull();

    const entity = CastMember.fake().anActor().build();
    await repository.insert(entity);
    entityFound = await repository.findById(entity.cast_member_id);
    expect(entity.toJSON()).toStrictEqual(entityFound!.toJSON());
  });

  it('should return all cast members', async () => {
    const entity = CastMember.fake().anActor().build();
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities.length).toBe(1);
    expect(JSON.stringify(entities)).toStrictEqual(JSON.stringify([entity]));
  });

  it('should throw error on update when a entity not found', async () => {
    const entity = CastMember.fake().anActor().build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.cast_member_id.id, CastMember),
    );
  });

  it('should update a entity', async () => {
    const entity = CastMember.fake().anActor().build();
    await repository.insert(entity);

    entity.changeName('Movie updated');
    await repository.update(entity);
    const entityFound = await repository.findById(entity.cast_member_id);
    expect(entityFound!.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should throw error on delete when a entity not found', async () => {
    const castMemberId = new Uuid();
    await expect(repository.delete(castMemberId)).rejects.toThrow(
      new NotFoundError(castMemberId.id, CastMember),
    );
  });

  it('should delete a entity', async () => {
    const entity = CastMember.fake().anActor().build();
    await repository.insert(entity);

    await repository.delete(entity.cast_member_id);

    await expect(
      repository.findById(entity.cast_member_id),
    ).resolves.toBeNull();
  });

  describe('search method tests', () => {
    it('should order by created_at DESC when search params are null', async () => {
      const castMembers = CastMember.fake()
        .theCastMembers(16)
        .withCreatedAt((index) => new Date(new Date().getTime() + 100 * index))
        .build();

      await repository.bulkInsert(castMembers);
      const spyToEntity = jest.spyOn(CastMemberModelMapper, 'toEntity');

      const searchOutput = await repository.search(
        CastMemberSearchParams.create(),
      );

      expect(searchOutput).toBeInstanceOf(CastMemberSearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });

      [...castMembers.slice(1, 16)].reverse().forEach((item, index) => {
        expect(searchOutput.items[index].toJSON()).toStrictEqual(item.toJSON());
        expect(item.toJSON()).toStrictEqual(searchOutput.items[index].toJSON());
      });
    });

    it('should apply paginate and filter by name', async () => {
      const castMembers = [
        CastMember.fake()
          .anActor()
          .withName('test')
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        CastMember.fake()
          .anActor()
          .withName('a')
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        CastMember.fake()
          .anActor()
          .withName('TEST')
          .withCreatedAt(new Date(new Date().getTime() + 2000))
          .build(),
        CastMember.fake()
          .anActor()
          .withName('TeSt')
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];

      await repository.bulkInsert(castMembers);

      let searchOutput = await repository.search(
        CastMemberSearchParams.create({
          page: 1,
          per_page: 2,
          filter: {
            name: 'TEST',
          },
        }),
      );

      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [castMembers[0], castMembers[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      );
    });

    it('should apply paginate and filter by type', async () => {
      const created_at = new Date();

      const castMembers = [
        CastMember.fake()
          .anActor()
          .withName('actor1')
          .withCreatedAt(created_at)
          .build(),
        CastMember.fake()
          .anActor()
          .withName('actor2')
          .withCreatedAt(created_at)
          .build(),
        CastMember.fake()
          .anActor()
          .withName('actor3')
          .withCreatedAt(created_at)
          .build(),
        CastMember.fake()
          .aDirector()
          .withName('director1')
          .withCreatedAt(created_at)
          .build(),
        CastMember.fake()
          .aDirector()
          .withName('director2')
          .withCreatedAt(created_at)
          .build(),
        CastMember.fake()
          .aDirector()
          .withName('director3')
          .withCreatedAt(created_at)
          .build(),
      ];

      await repository.bulkInsert(castMembers);
      const arrange = [
        {
          params: CastMemberSearchParams.create({
            page: 1,
            per_page: 2,
            filter: { type: CastMemberTypes.ACTOR },
          }),
          result: {
            items: [castMembers[0], castMembers[1]],
            total: 3,
            current_page: 1,
          },
        },
        {
          params: CastMemberSearchParams.create({
            page: 2,
            per_page: 2,
            filter: { type: CastMemberTypes.ACTOR },
          }),
          result: {
            items: [castMembers[2]],
            total: 3,
            current_page: 2,
          },
        },
        {
          params: CastMemberSearchParams.create({
            page: 1,
            per_page: 2,
            filter: { type: CastMemberTypes.DIRECTOR },
          }),
          result: {
            items: [castMembers[3], castMembers[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          },
        },
      ];

      for (const item of arrange) {
        const searchOutput = await repository.search(item.params);

        const { items, ...otherOutput } = searchOutput;
        const { items: itemsExpected, ...otherExpected } = item.result;
        expect(otherOutput).toMatchObject(otherExpected);
        orderBy(items, ['name']).forEach((item, key) => {
          expect(item.toJSON()).toStrictEqual(itemsExpected[key].toJSON());
        });
      }
    });

    describe('should search using filter by name, sort and paginate', () => {
      const castMembers = [
        CastMember.fake().anActor().withName('test').build(),
        CastMember.fake().anActor().withName('a').build(),
        CastMember.fake().anActor().withName('TEST').build(),
        CastMember.fake().anActor().withName('e').build(),
        CastMember.fake().anActor().withName('TeSt').build(),
      ];

      const arrange = [
        {
          search_params: CastMemberSearchParams.create({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: { name: 'TEST' },
          }),
          search_result: new CastMemberSearchResult({
            items: [castMembers[2], castMembers[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: CastMemberSearchParams.create({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: { name: 'TEST' },
          }),
          search_result: new CastMemberSearchResult({
            items: [castMembers[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(castMembers);
      });

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        },
      );
    });

    describe('should search using filter by type, sort and paginate', () => {
      const castMembers = [
        CastMember.fake().anActor().withName('test').build(),
        CastMember.fake().aDirector().withName('a').build(),
        CastMember.fake().anActor().withName('TEST').build(),
        CastMember.fake().aDirector().withName('e').build(),
        CastMember.fake().anActor().withName('TeSt').build(),
        CastMember.fake().aDirector().withName('b').build(),
      ];

      const arrange = [
        {
          search_params: CastMemberSearchParams.create({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: { type: CastMemberTypes.ACTOR },
          }),
          search_result: new CastMemberSearchResult({
            items: [castMembers[2], castMembers[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: CastMemberSearchParams.create({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: { type: CastMemberTypes.ACTOR },
          }),
          search_result: new CastMemberSearchResult({
            items: [castMembers[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          search_params: CastMemberSearchParams.create({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: { type: CastMemberTypes.DIRECTOR },
          }),
          search_result: new CastMemberSearchResult({
            items: [castMembers[3]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(castMembers);
      });

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        },
      );
    });

    describe('should search using filter by name and type, sort and paginate', () => {
      const castMembers = [
        CastMember.fake().anActor().withName('test').build(),
        CastMember.fake().aDirector().withName('a director').build(),
        CastMember.fake().anActor().withName('TEST').build(),
        CastMember.fake().aDirector().withName('e director').build(),
        CastMember.fake().anActor().withName('TeSt').build(),
        CastMember.fake().aDirector().withName('b director').build(),
      ];

      const arrange = [
        {
          search_params: CastMemberSearchParams.create({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: { name: 'TEST', type: CastMemberTypes.ACTOR },
          }),
          search_result: new CastMemberSearchResult({
            items: [castMembers[2], castMembers[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: CastMemberSearchParams.create({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: { name: 'TEST', type: CastMemberTypes.ACTOR },
          }),
          search_result: new CastMemberSearchResult({
            items: [castMembers[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(castMembers);
      });

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        },
      );
    });
  });
});
