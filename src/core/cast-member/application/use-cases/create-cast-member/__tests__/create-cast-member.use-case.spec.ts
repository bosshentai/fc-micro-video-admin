import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { CreateCastMemberUseCase } from '../create-cast-member.use-case';
import { CastMemberTypes } from '@core/cast-member/domain/value-object/cast-member-type.vo';
import { EntityValidationError } from '@core/shared/domain/validator/validation.error';
import e from 'express';

describe('CreateCastMemberUseCase Unit Tests', () => {
  let useCase: CreateCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new CreateCastMemberUseCase(repository);
    jest.restoreAllMocks();
  });

  describe('execute method', () => {
    it('should throw an generic error', async () => {
      const expectError = new Error('generic error');
      jest.spyOn(repository, 'insert').mockRejectedValueOnce(expectError);
      await expect(
        useCase.execute({
          name: 'test',
          type: CastMemberTypes.ACTOR,
        }),
      ).rejects.toThrow(expectError);
    });

    it('should throw an entity validation error', async () => {
      try {
        await useCase.execute({
          name: 'test',
          type: 'a' as any,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(EntityValidationError);
        expect(error.error).toStrictEqual([
          {
            type: ['Invalid cast member type: a'],
          },
        ]);
      }
      expect.assertions(2);
    });

    it('should create a cast member', async () => {
      const spyInsert = jest.spyOn(repository, 'insert');
      let output = await useCase.execute({
        name: 'test',
        type: CastMemberTypes.ACTOR,
      });
      expect(spyInsert).toHaveBeenCalledTimes(1);
      expect(output).toStrictEqual({
        id: repository.items[0].cast_member_id.id,
        name: 'test',
        type: CastMemberTypes.ACTOR,
        created_at: repository.items[0].created_at,
      });

      output = await useCase.execute({
        name: 'test',
        type: CastMemberTypes.DIRECTOR,
      });
      expect(spyInsert).toHaveBeenCalledTimes(2);
      expect(output).toStrictEqual({
        id: repository.items[1].cast_member_id.id,
        name: 'test',
        type: CastMemberTypes.DIRECTOR,
        created_at: repository.items[1].created_at,
      });
    });
  });
});
