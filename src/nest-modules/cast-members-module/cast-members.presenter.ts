import { PaginationOutput } from './../../core/shared/application/pagination-output';
import { CastMemberOutput } from '@core/cast-member/application/use-cases/common/cast-member-output';
import { CastMemberTypes } from '@core/cast-member/domain/value-object/cast-member-type.vo';
import { Transform } from 'class-transformer';
import { CollectionPresenter } from '../shared-module/collection.presenter';
import { ListCastMembersOutput } from '@core/cast-member/application/use-cases/list-cast-members/list-cast-member.use-case';

export class CastMemberPresenter {
  id: string;
  name: string;

  type: CastMemberTypes;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: CastMemberOutput) {
    this.id = output.id;
    this.name = output.name;
    this.type = output.type;
    this.created_at = output.created_at;
  }
}

export class CastMemberCollectionPresenter extends CollectionPresenter<CastMemberPresenter> {
  data: CastMemberPresenter[];

  constructor(output: ListCastMembersOutput) {
    const { items, ...paginationProps } = output;

    super(paginationProps);
    this.data = items.map((item) => new CastMemberPresenter(item));
  }
}
