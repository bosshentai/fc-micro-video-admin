import { CategoryId } from '@core/category/domain/category.aggregate';
import { Genre, GenreId } from './genre.aggregate';
import { Chance } from 'chance';
import _ from 'lodash';

type PropOrFactory<T> = T | ((index: number) => T);

export class GenreFakeBuilder<TBuild extends Genre | Genre[]> {
  private _genre_id: PropOrFactory<GenreId> | undefined = undefined;

  private _name: PropOrFactory<string> = (_index) => this.chance.word();

  private _categories_id: PropOrFactory<CategoryId>[] = [];

  private _is_active: PropOrFactory<boolean> = (_index) => true;

  private _created_at: PropOrFactory<Date> | undefined = undefined;

  private countObjs: number;

  private chance: Chance.Chance;

  static aGenre() {
    return new GenreFakeBuilder<Genre>();
  }

  static theGenres(countObjs: number) {
    return new GenreFakeBuilder<Genre[]>(countObjs);
  }

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = new Chance();
  }

  withGenreId(valueOrFactory: PropOrFactory<GenreId>) {
    this._genre_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  addCategoyId(valueOrFactory: PropOrFactory<CategoryId>) {
    this._categories_id.push(valueOrFactory);
    return this;
  }

  active() {
    this._is_active = true;
    return this;
  }

  deactive() {
    this._is_active = false;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  withCreatedAt(valeuOrFactory: PropOrFactory<Date>) {
    this._created_at = valeuOrFactory;
    return this;
  }

  private callFactory<T>(factoryOrValue: PropOrFactory<T>, index: number): T {
    return typeof factoryOrValue === 'function'
      ? (factoryOrValue as (index: number) => T)(index)
      : factoryOrValue;
  }

  private getValue<T>(prop: string): T {
    const optional = ['genre_id', 'created_at'];
    const privateProps = `_${prop}` as keyof this;
    if (!this[privateProps] && optional.includes(prop)) {
      throw new Error(`Property ${prop} not have factory, use 'with' methods`);
    }
    return this.callFactory(this[privateProps], 0) as T;
  }

  get genred_id(): GenreId {
    return this.getValue<GenreId>('genre_id');
  }

  get name(): string {
    return this.getValue<string>('name');
  }

  get categories_id(): CategoryId[] {
    let categories_id = this.getValue<CategoryId[]>('categories_id');

    if (!categories_id.length) {
      categories_id = [new CategoryId()];
    }
    return categories_id;
  }

  get is_active() {
    return this.getValue<boolean>('is_active');
  }

  get created_at() {
    return this.getValue<Date>('created_at');
  }

  build(): TBuild {
    const Genres = new Array(this.countObjs).fill(undefined).map((_, index) => {
      const categoryId = new CategoryId();
      const categoriesId = this._categories_id.length
        ? this.callFactory(this._categories_id, index)
        : [categoryId];

      const genre = new Genre({
        genre_id: !this._genre_id
          ? undefined
          : this.callFactory(this._genre_id, index),
        name: this.callFactory(this._name, index),
        categories_id: new Map(
          categoriesId.map((categororyId) => {
            const categoryId =
              typeof categororyId === 'function'
                ? categororyId(index)
                : categororyId;
            return [categoryId.id, categoryId];
          }),
        ),
        is_active: this.callFactory(this._is_active, index),
        ...(this._created_at && {
          created_at: this.callFactory(this._created_at, index),
        }),
      });
      genre.validate();
      return genre;
    });

    return this.countObjs === 1 ? (Genres[0] as TBuild) : (Genres as TBuild);
  }
}
