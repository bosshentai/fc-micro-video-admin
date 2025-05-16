import { Test, TestingModule } from '@nestjs/testing';
import { CastMembersController } from '../cast-members.controller';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { CastMembersModule } from '../cast-members.module';
import { getModelToken } from '@nestjs/sequelize';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';

describe('CastMembersController', () => {
  let controller: CastMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({}), CastMembersModule],
    })
      .overrideProvider(getModelToken(CastMemberModel))
      .useValue({})
      .overrideProvider('CastMemberRepository')
      .useValue(CastMemberInMemoryRepository)
      .compile();

    controller = module.get<CastMembersController>(CastMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
