import { Transform } from 'class-transformer/';

export type PaginationPresenterProps = {
  current_page: number | string;
  per_page: number | string;
  last_page: number | string;
  total: number | string;
};

export class PaginationPresenter {
  @Transform(({ value }) => parseInt(value))
  current_page: number | string;

  @Transform(({ value }) => parseInt(value))
  per_page: number | string;

  @Transform(({ value }) => parseInt(value))
  last_page: number | string;

  @Transform(({ value }) => parseInt(value))
  total: number | string;

  constructor(props: PaginationPresenterProps) {
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = props.last_page;
    this.total = props.total;
  }
}
