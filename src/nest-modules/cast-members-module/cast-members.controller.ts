import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { ParseUUIDPipe } from '@nestjs/common';
import { CreateCastMemberDto } from './dto/create-cast-member.dto';
import { CastMemberOutput } from '@core/cast-member/application/use-cases/common/cast-member-output';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from './cast-members.presenter';
import { GetCastMemberUseCase } from '@core/cast-member/application/use-cases/get-cast-member/get-cast-member.use-case';
import { ListCastMembersUseCase } from '@core/cast-member/application/use-cases/list-cast-members/list-cast-member.use-case';
import { SearchCastMembersDto } from './dto/search-cast-members.dto';
import { UpdateCastMemberDto } from './dto/update-cast-member.dto';
import { UpdateCastMemberUseCase } from '@core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case';
import { DeleteCastMemberUseCase } from '@core/cast-member/application/use-cases/delete-cast-member/delete-cast-member.use-case';
import { CreateCastMemberUseCase } from '@core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';

@Controller('cast-members')
export class CastMembersController {
  @Inject(CreateCastMemberUseCase)
  private createUseCase: CreateCastMemberUseCase;

  @Inject(ListCastMembersUseCase)
  private listUseCase: ListCastMembersUseCase;

  @Inject(GetCastMemberUseCase)
  private getUseCase: GetCastMemberUseCase;

  @Inject(UpdateCastMemberUseCase)
  private updateUseCase: UpdateCastMemberUseCase;

  @Inject(DeleteCastMemberUseCase)
  private deleteUseCase: DeleteCastMemberUseCase;
  @Post()
  async create(@Body() createCastMemberDto: CreateCastMemberDto) {
    const output = await this.createUseCase.execute(createCastMemberDto);

    return CastMembersController.serialize(output);
  }

  @Get()
  async search(@Query() searchParamsDto: SearchCastMembersDto) {
    const output = await this.listUseCase.execute(searchParamsDto);
    return new CastMemberCollectionPresenter(output);
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
    return CastMembersController.serialize(output);
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
    @Body() updateCastMemberDto: UpdateCastMemberDto,
  ) {
    const output = await this.updateUseCase.execute({
      id,
      ...updateCastMemberDto,
    });

    return CastMembersController.serialize(output);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ) {
    return this.deleteUseCase.execute({ id });
  }
  static serialize(output: CastMemberOutput) {
    return new CastMemberPresenter(output);
  }
}
