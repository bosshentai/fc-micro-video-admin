import { IUseCase } from '@core/shared/application/use-case.interface';
import { GenreOutput, GenreOutputMapper } from '../common/genre-output';
import { IGenreRepository } from '@core/genre/domain/genre.repository';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { Genre, GenreId } from '@core/genre/domain/genre.aggregate';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

export class GetGenreUseCase
  implements IUseCase<GetGenreInput, GetGenreOutput>
{
  constructor(
    private genreRepo: IGenreRepository,
    private categoryRepo: ICategoryRepository,
  ) {}

  async execute(input: GetGenreInput): Promise<GenreOutput> {
    const genreId = new GenreId(input.id);

    const genre = await this.genreRepo.findById(genreId);

    if (!genre) {
      throw new NotFoundError(genreId.id, Genre);
    }

    const categories = await this.categoryRepo.findByIds([
      ...genre.categories_id.values(),
    ]);

    return GenreOutputMapper.toOutput(genre, categories);
  }
}

export type GetGenreInput = {
  id: string;
};

export type GetGenreOutput = GenreOutput;
