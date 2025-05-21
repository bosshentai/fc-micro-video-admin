import { VideoCategoryPresenter } from '../presenter/video-category.presenter';

describe('VideoCategoryPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should create a  category presenter', () => {
      const presenter = new VideoCategoryPresenter({
        id: '1',
        name: 'Movie',
        created_at: new Date(),
      });

      expect(presenter).toBeInstanceOf(VideoCategoryPresenter);
    });
  });
});
