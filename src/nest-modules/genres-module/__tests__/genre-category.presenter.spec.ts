import { GenreCategoryPresenter } from '../genre-category.presenter';

describe('GenreCategoryPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should create a category presenter', () => {});
    const presenter = new GenreCategoryPresenter({
      id: '1',
      name: 'Movie',
      created_at: new Date(),
    });

    expect(presenter).toBeInstanceOf(GenreCategoryPresenter);
  });
});
