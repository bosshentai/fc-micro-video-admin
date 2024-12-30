import { Op } from "sequelize";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";
import { CategoryModelMapper } from "./category-model-mapper";

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ["name", "created_at"];

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    const modelProps = CategoryModelMapper.toModel(entity);
    await this.categoryModel.create(modelProps.toJSON());
    // await this.categoryModel.create({
    //   category_id: entity.category_id.id,
    //   name: entity.name,
    //   description: entity.description,
    //   is_active: entity.is_active,
    //   created_at: entity.created_at,
    // });
  }
  async bulkInsert(entities: Category[]): Promise<void> {
    const models = entities.map((entities) =>
      CategoryModelMapper.toModel(entities).toJSON()
    );
    await this.categoryModel.bulkCreate(models);
    // await this.categoryModel.bulkCreate(
    //   entities.map((entity) => ({
    //     category_id: entity.category_id.id,
    //     name: entity.name,
    //     description: entity.description,
    //     is_active: entity.is_active,
    //     created_at: entity.created_at,
    //   }))
    // );
  }
  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    const modelProps = CategoryModelMapper.toModel(entity);

    await this.categoryModel.update(modelProps.toJSON(), {
      where: {
        category_id: id,
      },
    });
    // await this.categoryModel.update(
    //   {
    //     category_id: entity.category_id.id,
    //     name: entity.name,
    //     description: entity.description,
    //     is_active: entity.is_active,
    //     created_at: entity.created_at,
    //   },
    //   {
    //     where: {
    //       category_id: id,
    //     },
    //   }
    // );
  }
  async delete(category_id: Uuid): Promise<void> {
    const id = category_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    await this.categoryModel.destroy({ where: { category_id: id } });
  }
  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this._get(entity_id.id);

    return model ? CategoryModelMapper.toEntity(model) : null;

    // return model
    //   ? new Category({
    //       category_id: new Uuid(model.category_id),
    //       name: model.name,
    //       description: model.description,
    //       is_active: model.is_active,
    //       created_at: model.created_at,
    //     })
    //   : null;
  }
  private async _get(id: string) {
    return await this.categoryModel.findByPk(id);
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();

    return models.map((model) => {
      return CategoryModelMapper.toEntity(model);
    });

    // return models.map((model) => {
    //   return new Category({
    //     category_id: new Uuid(model.category_id),
    //     name: model.name,
    //     description: model.description,
    //     is_active: model.is_active,
    //     created_at: model.created_at,
    //   });
    // });
  }
  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offtSet = props.per_page * (props.page - 1);
    const limit = props.per_page;
    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: [[props.sort, props.sort_dir]] }
        : { order: [["created_at", "desc"]] }),
      offset: offtSet,
      limit,
    });

    return new CategorySearchResult({
      items: models.map((model) => {
        return CategoryModelMapper.toEntity(model);
        // return new Category({
        //   category_id: new Uuid(model.category_id),
        //   name: model.name,
        //   description: model.description,
        //   is_active: model.is_active,
        //   created_at: model.created_at,
        // });
      }),
      total: count,
      current_page: props.page,
      per_page: props.per_page,
    });
  }
}
