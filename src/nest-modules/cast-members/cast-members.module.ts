import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CAST_MEMBER_PROVIDERS } from './cast-members.providers';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { CastMembersController } from './cast-members.controller';

@Module({
  imports: [SequelizeModule.forFeature([CastMemberModel])],
  controllers: [CastMembersController],
  providers: [
    ...Object.values(CAST_MEMBER_PROVIDERS.REPOSITORIES),
    ...Object.values(CAST_MEMBER_PROVIDERS.USE_CASES),
  ],
})
export class CastMembersModule {}
