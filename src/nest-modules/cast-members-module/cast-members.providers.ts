import { getModelToken } from '@nestjs/sequelize';
import { CreateCastMemberUseCase } from '@core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';
import { CastMemberModel } from './../../core/cast-member/infra/db/sequelize/cast-member.model';
import { CastMemberInMemoryRepository } from '../../core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { CastMemberSequelizeRepository } from '../../core/cast-member/infra/db/sequelize/cast-member-sequelize';
import { CategorySequelizeRepository } from '../../core/category/infra/db/sequelize/category-sequelize.repository';
import { ICastMemberRepository } from '../../core/cast-member/domain/cast-member.repository';
import { UpdateCastMemberUseCase } from '../../core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case';
import { GetCastMemberUseCase } from '../../core/cast-member/application/use-cases/get-cast-member/get-cast-member.use-case';
import { DeleteCastMemberUseCase } from '../../core/cast-member/application/use-cases/delete-cast-member/delete-cast-member.use-case';
import { ListCastMembersUseCase } from '../../core/cast-member/application/use-cases/list-cast-members/list-cast-member.use-case';
import { CastMembersIdExistsInDatabaseValidator } from '@core/cast-member/application/valitations/cast-members-ids-exists-in-database.validator';

export const REPOSITORIES = {
  CAST_MEMBER_REPOSITORY: {
    provide: 'CastMemberRepository',
    useExisting: CategorySequelizeRepository,
  },
  CAST_IN_MEMORY_REPOSITORY: {
    provide: CastMemberInMemoryRepository,
    useClass: CastMemberInMemoryRepository,
  },
  CAST_MEMBER_SEQUELIZE_REPOSITORY: {
    provide: CategorySequelizeRepository,
    useFactory: (castMemberModel: typeof CastMemberModel) => {
      return new CastMemberSequelizeRepository(castMemberModel);
    },
    inject: [getModelToken(CastMemberModel)],
  },
};

export const USE_CASES = {
  CREATE_CAST_MEMBER_USE_CASE: {
    provide: CreateCastMemberUseCase,
    useFactory: (castMemberRepo: ICastMemberRepository) => {
      return new CreateCastMemberUseCase(castMemberRepo);
    },
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },

  UPDATE_CAST_MEMBER_USE_CASE: {
    provide: UpdateCastMemberUseCase,
    useFactory: (castMemberRepo: ICastMemberRepository) => {
      return new UpdateCastMemberUseCase(castMemberRepo);
    },
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },

  LIST_CAST_MEMBER_USE_CASE: {
    provide: ListCastMembersUseCase,
    useFactory: (castMemberRepo: ICastMemberRepository) => {
      return new ListCastMembersUseCase(castMemberRepo);
    },
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
  GET_CAST_MEMBER_USE_CASE: {
    provide: GetCastMemberUseCase,
    useFactory: (castMemberRepo: ICastMemberRepository) => {
      return new GetCastMemberUseCase(castMemberRepo);
    },
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
  DELETE_CAST_MEMBER_USE_CASE: {
    provide: DeleteCastMemberUseCase,
    useFactory: (castMemberRepo: ICastMemberRepository) => {
      return new DeleteCastMemberUseCase(castMemberRepo);
    },
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
};
export const VALIDATIONS = {
  CAST_MEMBERS_IDS_EXISTS_IN_DATABASE_VALIDATOR: {
    provide: CastMembersIdExistsInDatabaseValidator,
    useFactory: (castMemberRepo: ICastMemberRepository) => {
      return new CastMembersIdExistsInDatabaseValidator(castMemberRepo);
    },
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
};

export const CAST_MEMBER_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
  VALIDATIONS,
};
