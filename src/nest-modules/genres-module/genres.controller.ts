import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { GenreOutput } from '@core/genre/application/use=cases/common/genre-output';
import { CreateGenreUseCase } from '@core/genre/application/use=cases/create-genre/create-genre.use-case';
import { DeleteGenreUseCase } from '@core/genre/application/use=cases/delete-genre/delete-genre.use-case';
import { GetGenreUseCase } from '@core/genre/application/use=cases/get-genre/get-genre.use-case';
import { ListGenresUseCase } from '@core/genre/application/use=cases/list-genres/list-genres.use-case';
import { UpdateGenreUseCase } from '@core/genre/application/use=cases/update-genre/update-genre.use-case';

import { GenreCollectionPresenter, GenrePresenter } from './genres.presenter';
import { CreateGenreDto } from './dto/create-genre.dto';
import { SearchGenreDto } from './dto/search-gernre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Controller('genres')
export class GenresController {
  @Inject(CreateGenreUseCase)
  private createUseCase: CreateGenreUseCase;

  @Inject(UpdateGenreUseCase)
  private updateUseCase: UpdateGenreUseCase;

  @Inject(DeleteGenreUseCase)
  private deleteUseCase: DeleteGenreUseCase;

  @Inject(GetGenreUseCase)
  private getUseCase: GetGenreUseCase;

  @Inject(ListGenresUseCase)
  private listUseCase: ListGenresUseCase;

  @Post()
  async create(@Body() createGenreDto: CreateGenreDto) {
    const output = await this.createUseCase.execute(createGenreDto);

    return GenresController.serialize(output);
  }

  @Get()
  async search(@Query() searchParams: SearchGenreDto) {
    const output = await this.listUseCase.execute(searchParams);
    return new GenreCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ) {
    const output = await this.getUseCase.execute({ id });
    return GenresController.serialize(output);
  }

  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    const output = await this.updateUseCase.execute({ id, ...updateGenreDto });
    return GenresController.serialize(output);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ) {
    return await this.deleteUseCase.execute({ id });
  }

  static serialize(output: GenreOutput) {
    return new GenrePresenter(output);
  }
}
