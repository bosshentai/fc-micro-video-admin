import { PaginationPresenter } from 'src/nest-modules/shared-module/pagination.presenter';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from '../cast-members.presenter';

describe('CastMemberPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should create a cast member presenter', () => {
      const presenter = new CastMemberPresenter({
        id: '1',
        name: 'test',
        type: 1,
        created_at: new Date(),
      });

      expect(presenter).toBeInstanceOf(CastMemberPresenter);
    });
  });
});

describe('CastMemberCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should return a category collection presenter', () => {
      const presenter = new CastMemberCollectionPresenter({
        items: [
          {
            id: '1',
            name: 'test',
            type: 1,
            created_at: new Date(),
          },
        ],
        current_page: 1,
        per_page: 15,
        last_page: 1,
        total: 1,
      });

      expect(presenter).toBeInstanceOf(CastMemberCollectionPresenter);
      expect(presenter.data[0]).toBeInstanceOf(CastMemberPresenter);
      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.data.length).toBe(1);
      expect(presenter.data[0].id).toBe('1');
      expect(presenter.data[0].name).toBe('test');
      expect(presenter.data[0].created_at).toBeInstanceOf(Date);
      expect(presenter.meta.current_page).toBe(1);
      expect(presenter.meta.last_page).toBe(1);
      expect(presenter.meta.per_page).toBe(15);
      expect(presenter.meta.total).toBe(1);
    });
  });
});
