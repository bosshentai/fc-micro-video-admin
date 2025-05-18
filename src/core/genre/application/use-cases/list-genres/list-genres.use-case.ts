import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@core/shared/application/pagination-output';
import { GenreOutput, GenreOutputMapper } from '../common/genre-output';
import { ListGenresInput } from './list-genres.input';
import { IUseCase } from '@core/shared/application/use-case.interface';
import {
  GenreSearchParams,
  GenreSearchResult,
  IGenreRepository,
} from '@core/genre/domain/genre.repository';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { CategoryId } from '@core/category/domain/category.aggregate';

export class ListGenresUseCase
  implements IUseCase<ListGenresInput, ListGenresOutput>
{
  constructor(
    private genreRepo: IGenreRepository,
    private categoryRepo: ICategoryRepository,
  ) {}

  async execute(input: ListGenresInput): Promise<ListGenresOutput> {
    const params = GenreSearchParams.create(input);

    const searchResult = await this.genreRepo.search(params);
    return this.toOutput(searchResult);
  }

  private async toOutput(searchResult: GenreSearchResult) {
    const { items: _items } = searchResult;
    const categoriesIdRelated = searchResult.items.reduce<CategoryId[]>(
      (acc, item) => {
        return acc.concat(Array.from(item.categories_id.values()));
      },
      [],
    );
    //TODO - retirar duplicados
    const categoriesRelated =
      await this.categoryRepo.findByIds(categoriesIdRelated);

    const items = _items.map((item) => {
      const categoriesOfGenres = categoriesRelated.filter((category) =>
        item.categories_id.has(category.category_id.id),
      );
      return GenreOutputMapper.toOutput(item, categoriesOfGenres);
    });

    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListGenresOutput = PaginationOutput<GenreOutput>;
