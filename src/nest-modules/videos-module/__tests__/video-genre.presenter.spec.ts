import { VideoGenrePresenter } from '../presenter/video-genre.presenter';

describe('VideoGenrePresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should create a genre presenter', () => {
      const presenter = new VideoGenrePresenter({
        id: '1',
        name: 'action',
        is_active: true,
        created_at: new Date(),
        categories_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
        categories: [
          {
            id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
            name: 'action',
            created_at: new Date(),
          },
        ],
      });

      expect(presenter).toBeInstanceOf(VideoGenrePresenter);
    });
  });
});
