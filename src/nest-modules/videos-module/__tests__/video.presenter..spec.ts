import { RatingValues } from '@core/video/domain/value-object/rating.vo';
import {
  VideoCollectionPresenter,
  VideoPresenter,
} from '../presenter/video.presenter';
import { PaginationPresenter } from 'src/nest-modules/shared-module/pagination.presenter';

describe('VideoPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should create a video presenter', () => {
      const presenter = new VideoPresenter({
        id: '1',
        title: 'test',
        description: 'test',
        year_launched: 2020,
        duration: 100,
        rating: RatingValues.RL,
        is_opened: true,
        is_published: true,
        categories_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
        categories: [
          {
            id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
            name: 'action',
            created_at: new Date(),
          },
        ],
        genres_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
        genres: [
          {
            id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
            categories_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
            categories: [
              {
                id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
                name: 'action',
                created_at: new Date(),
              },
            ],
            name: 'action',
            is_active: true,
            created_at: new Date(),
          },
        ],
        cast_members_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
        cast_members: [
          {
            id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
            name: 'action',
            type: 1,
            created_at: new Date(),
          },
        ],
        created_at: new Date(),
      });

      expect(presenter).toBeInstanceOf(VideoPresenter);
    });
  });
});

describe('VideoCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should return a video collection presenter', () => {
      const presenter = new VideoCollectionPresenter({
        items: [
          {
            id: '1',
            title: 'test',
            description: 'test',
            year_launched: 2020,
            duration: 100,
            rating: RatingValues.RL,
            is_opened: true,
            is_published: true,
            categories_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
            categories: [
              {
                id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
                name: 'action',
                created_at: new Date(),
              },
            ],
            genres_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
            genres: [
              {
                id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
                categories_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
                categories: [
                  {
                    id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
                    name: 'action',
                    created_at: new Date(),
                  },
                ],
                name: 'action',
                is_active: true,
                created_at: new Date(),
              },
            ],
            cast_members_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
            cast_members: [
              {
                id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
                name: 'action',
                type: 1,
                created_at: new Date(),
              },
            ],
            created_at: new Date(),
          },
        ],
        current_page: 1,
        per_page: 15,
        last_page: 1,
        total: 1,
      });

      expect(presenter).toBeInstanceOf(VideoCollectionPresenter);
      expect(presenter.data[0]).toBeInstanceOf(VideoPresenter);
      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.data.length).toBe(1);
      expect(presenter.data[0].id).toBe('1');
      expect(presenter.data[0].title).toBe('test');
      expect(presenter.data[0].description).toBe('test');
      expect(presenter.data[0].year_launched).toBe(2020);
      expect(presenter.data[0].duration).toBe(100);
      expect(presenter.data[0].rating).toBe(RatingValues.RL);
      expect(presenter.data[0].is_opened).toBe(true);
      expect(presenter.data[0].is_published).toBe(true);
      expect(presenter.data[0].created_at).toBeInstanceOf(Date);
      expect(presenter.meta.current_page).toBe(1);
      expect(presenter.meta.last_page).toBe(1);
      expect(presenter.meta.per_page).toBe(15);
      expect(presenter.meta.total).toBe(1);
    });
  });
});
