import { GenreCategoryOutput } from '@core/genre/application/use-cases/common/genre-output';
import { Transform } from 'class-transformer';

export class GenreCategoryPresenter {
  id: string;

  name: string;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: GenreCategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.created_at = output.created_at;
  }
}
