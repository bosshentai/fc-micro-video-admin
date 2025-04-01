import { PaginationPresenter } from 'src/nest-modules/shared-module/pagination.presenter';
import { GenreCollectionPresenter, GenrePresenter } from '../genres.presenter';

describe('GenresPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should create a genre presenter', () => {
      const presenter = new GenrePresenter({
        id: '1',
        name: 'action',
        categories: [
          {
            id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
            name: 'horror',
            created_at: new Date(),
          },
        ],
        is_active: true,
        categories_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
        created_at: new Date(),
      });

      expect(presenter).toBeInstanceOf(GenrePresenter);
    });
  });
});

describe('GenreCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should return a genre collection presenter', () => {
      const presenter = new GenreCollectionPresenter({
        items: [
          {
            id: '1',
            name: 'action',
            categories: [
              {
                id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
                name: 'horror',
                created_at: new Date(),
              },
            ],
            is_active: true,
            categories_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
            created_at: new Date(),
          },
        ],
        current_page: 1,
        per_page: 15,
        last_page: 1,
        total: 1,
      });

      expect(presenter).toBeInstanceOf(GenreCollectionPresenter);
      expect(presenter.data[0]).toBeInstanceOf(GenrePresenter);
      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.data.length).toBe(1);
      expect(presenter.data[0].id).toBe('1');
      expect(presenter.data[0].name).toBe('action');
      expect(presenter.data[0].created_at).toBeInstanceOf(Date);
      expect(presenter.meta.current_page).toBe(1);
      expect(presenter.meta.last_page).toBe(1);
      expect(presenter.meta.per_page).toBe(15);
      expect(presenter.meta.total).toBe(1);
    });
  });
});
