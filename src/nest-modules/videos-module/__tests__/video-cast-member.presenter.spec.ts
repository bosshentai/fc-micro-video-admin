import { VideoCastMemberPresenter } from '../presenter/video-cast.member.presenter';

describe('VideoCastMemberPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should create a cast member presenter', () => {
      const presenter = new VideoCastMemberPresenter({
        id: '1',
        name: 'test',
        type: 1,
        created_at: new Date(),
      });

      expect(presenter).toBeInstanceOf(VideoCastMemberPresenter);
    });
  });
});
