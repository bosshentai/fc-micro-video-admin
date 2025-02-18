import { CreateCastMemberUseCase } from '@core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';
import { Body, Controller, Inject, Post } from '@nestjs/common/decorators';
import { CreateCastMemberDto } from './dto/create-cast-member.dto';

@Controller('cast-members')
export class CastMembersController {
  @Inject(CreateCastMemberUseCase)
  private createUseCase: CreateCastMemberUseCase;

  @Post()
  async create(@Body() createCastMemberDto: CreateCastMemberDto) {}
}
