import { PaginationPresenter } from 'src/nest-modules/shared-module/pagination.presenter';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../categories.presenter';

describe('CategoryPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should create a category presenter', () => {
      const presenter = new CategoryPresenter({
        id: '1',
        name: 'Movie',
        description: 'some description',
        is_active: true,
        created_at: new Date(),
      });

      expect(presenter).toBeInstanceOf(CategoryPresenter);
    });
  });
});

describe('CategoryCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should return a category collection presenter', () => {
      const presenter = new CategoryCollectionPresenter({
        items: [
          {
            id: '1',
            name: 'Movie',
            description: 'some description',
            is_active: true,
            created_at: new Date(),
          },
        ],
        current_page: 1,
        per_page: 15,
        last_page: 1,
        total: 1,
      });

      expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
      expect(presenter.data[0]).toBeInstanceOf(CategoryPresenter);
      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.data.length).toBe(1);
      expect(presenter.data[0].id).toBe('1');
      expect(presenter.data[0].name).toBe('Movie');
      expect(presenter.data[0].description).toBe('some description');
      expect(presenter.data[0].created_at).toBeInstanceOf(Date);
      expect(presenter.meta.current_page).toBe(1);
      expect(presenter.meta.last_page).toBe(1);
      expect(presenter.meta.per_page).toBe(15);
      expect(presenter.meta.total).toBe(1);
    });
  });
});
