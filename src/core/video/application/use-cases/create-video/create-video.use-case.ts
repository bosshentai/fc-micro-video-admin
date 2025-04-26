import { IUseCase } from '@core/shared/application/use-case.interface';
import { CreateVideoInput } from './create-video.input';
import { IUnitOfWork } from '@core/shared/domain/repository/unit-of-work.interface';
import { IVideoRepository } from '@core/video/domain/video.repository';
import { CategoriesIdExistsInDatabaseValidator } from '@core/category/application/validations/categories-ids-exists-in-database.validator';
import { CastMembersIdExistsInDatabaseValidator } from '@core/cast-member/application/valitations/cast-members-ids-exists-in-database.validator';

export class CreateVideoUseCase
  implements IUseCase<CreateVideoInput, CreateVideoOutput>
{
  constructor(
    private uow: IUnitOfWork,
    private videoRepo: IVideoRepository,
    private categoriesIdValidator: CategoriesIdExistsInDatabaseValidator,
    private genresIdValidator: GenresIdExistsInDatabaseValidator,
    private castMembersIdValidator: CastMembersIdExistsInDatabaseValidator,
  ) {}

  execute(input: CreateVideoInput): Promise<CreateVideoOutput> {
    throw new Error('Method not implemented.');
  }
}

export type CreateVideoOutput = {
  id: string;
};
