import { UpdateGenreInput } from '@core/genre/application/use-cases/update-genre/update-genre.input';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateGenreInputWithOutId extends OmitType(UpdateGenreInput, [
  'id',
] as const) {}

export class UpdateGenreDto extends UpdateGenreInputWithOutId {}
