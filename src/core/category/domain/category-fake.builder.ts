import { Chance } from 'chance';
import _ from 'lodash';
import { Category, CategoryId } from './category.aggregate';

type PropOrFactory<T> = T | ((index: number) => T);
export class CategoryFakeBuilder<TBuild extends Category | Category[]> {
  private chance: Chance.Chance;

  private _category_id: PropOrFactory<CategoryId> | undefined = undefined;

  private _name: PropOrFactory<string> = (_index) => this.chance.word();

  private _description: PropOrFactory<string | null> = (_index) =>
    this.chance.paragraph();

  private _is_active: PropOrFactory<boolean> = (_index) => true;

  private _created_at: PropOrFactory<Date> | undefined = undefined;

  private countObjs: number;

  static aCategory(): CategoryFakeBuilder<Category> {
    return new CategoryFakeBuilder<Category>();
  }

  static theCategories(countObjs: number): CategoryFakeBuilder<Category[]> {
    return new CategoryFakeBuilder<Category[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = new Chance();
  }

  withUuid(valueOrFactory: PropOrFactory<CategoryId>) {
    this._category_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withDescription(valueOrFactory: PropOrFactory<string | null>) {
    this._description = valueOrFactory;
    return this;
  }

  activate() {
    this._is_active = true;
    return this;
  }

  deactivate() {
    this._is_active = false;
    return this;
  }

  withCreatedAt(valeuOrFactory: PropOrFactory<Date>) {
    this._created_at = valeuOrFactory;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }

  private getValue(prop: any) {
    const optional = ['category_id', 'created_at'];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(`Property ${prop} not have factory, use 'with' methods`);
    }
    return this.callFactory(this[privateProp], 0);
  }

  get category_id() {
    return this.getValue('category_id');
  }

  get name() {
    return this.getValue('name');
  }

  get description() {
    return this.getValue('description');
  }

  get is_active() {
    return this.getValue('is_active');
  }

  get created_at() {
    return this.getValue('created_at');
  }

  build(): TBuild {
    const categories = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const category = new Category({
          category_id: !this._category_id
            ? undefined
            : this.callFactory(this._category_id, index),
          name: this.callFactory(this._name, index),
          description: this.callFactory(this._description, index),
          is_active: this.callFactory(this._is_active, index),
          ...(this._created_at && {
            created_at: this.callFactory(this._created_at, index),
          }),
        });
        category.validate();
        return category;
      });
    return this.countObjs === 1
      ? (categories[0] as TBuild)
      : (categories as TBuild);
  }
}
