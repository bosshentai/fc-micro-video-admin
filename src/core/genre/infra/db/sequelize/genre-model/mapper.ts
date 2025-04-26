import { CategoryId } from '@core/category/domain/category.aggregate';
import { GenreModel } from '../genre-model';
import { Notification } from '@core/shared/domain/validator/notification';
import { Genre, GenreId } from '@core/genre/domain/genre.aggregate';
import { LoadEntityError } from '@core/shared/domain/validator/validation.error';
import { GenreCategoryModel } from '../genre-category-model';

export class GenreModelMapper {
  static toEntity(model: GenreModel) {
    const { genre_id: id, categories_id = [], ...otherData } = model.toJSON();
    const categoriesId = categories_id.map(
      (category) => new CategoryId(category.category_id),
    );

    const notification = new Notification();
    if (!categoriesId.length) {
      notification.addError(
        'categories_id should not be empty',
        'categories_id',
      );
    }

    const genre = new Genre({
      ...otherData,
      genre_id: new GenreId(id),
      categories_id: new Map(categoriesId.map((id) => [id.id, id])),
    });

    genre.validate();

    notification.copyErrors(genre.notification);

    if (notification.hasErrors()) {
      throw new LoadEntityError(notification.toJSON());
    }

    return genre;
  }

  static toModelProps(aggregate: Genre) {
    const { categories_id, ...otherData } = aggregate.toJSON();
    return {
      ...otherData,
      categories_id: categories_id.map(
        (category_id) =>
          new GenreCategoryModel({
            category_id: category_id,
            genre_id: aggregate.genre_id.id,
          }),
      ),
    };
  }
}
