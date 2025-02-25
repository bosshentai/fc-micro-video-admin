import { SortDirection } from '../domain/repository/search-params';

export type SearchInput<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};
