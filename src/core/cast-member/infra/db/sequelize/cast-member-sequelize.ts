import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import {
  CastMemberSearchParams,
  CastMemberSearchResult,
  ICastMemberRepository,
} from './../../../domain/cast-member.repository';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { literal, Op } from 'sequelize';
import { CastMemberModel } from './cast-member.model';
import { CastMemberModelMapper } from './cast-member.mapper';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

export class CastMemberSequelizeRepository implements ICastMemberRepository {
  sortableFields: string[] = ['name', 'created_at'];

  orderBy = {
    mysql: {
      name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`),
    },
  };

  constructor(private castMemberModel: typeof CastMemberModel) {}

  async insert(entity: CastMember): Promise<void> {
    await this.castMemberModel.create(entity.toJSON());
  }
  async bulkInsert(entities: CastMember[]): Promise<void> {
    await this.castMemberModel.bulkCreate(
      entities.map((entity) => entity.toJSON()),
    );
  }

  async findById(entity_id: Uuid): Promise<CastMember | null> {
    const model = await this._get(entity_id.id);

    return model ? CastMemberModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<CastMember[]> {
    const models = await this.castMemberModel.findAll();

    return models.map((model) => CastMemberModelMapper.toEntity(model));
  }

  async delete(cast_member_id: Uuid): Promise<void> {
    const id = cast_member_id.id;
    const affectedRows = await this.castMemberModel.destroy({
      where: { cast_member_id: id },
    });
    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async update(castMember: CastMember): Promise<void> {
    const id = castMember.cast_member_id.id;

    const [affectedRows] = await this.castMemberModel.update(
      castMember.toJSON(),
      {
        where: {
          cast_member_id: castMember.cast_member_id.id,
        },
      },
    );

    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async search(props: CastMemberSearchParams): Promise<CastMemberSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;

    const where = {};
    if (props.filter && (props.filter.name || props.filter.type)) {
      if (props.filter.name) {
        where['name'] = { [Op.like]: `%${props.filter.name}%` };
      }

      if (props.filter.type) {
        where['type'] = props.filter.type.type;
      }
    }

    const { rows: models, count } = await this.castMemberModel.findAndCountAll({
      ...(props.filter && {
        where,
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? {
            order: this.formatSort(props.sort, props.sort_dir!),
          }
        : { order: [['created_at', 'DESC']] }),
      offset,
      limit,
    });

    return new CastMemberSearchResult({
      items: models.map((model) => {
        return CastMemberModelMapper.toEntity(model);
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }
  getEntity(): new (...args: any[]) => CastMember {
    return CastMember;
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.castMemberModel.sequelize!.getDialect() as 'mysql';
    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir);
    }

    return [[sort, sort_dir]];
  }

  private async _get(id: string): Promise<CastMemberModel | null> {
    return this.castMemberModel.findByPk(id);
  }
}
