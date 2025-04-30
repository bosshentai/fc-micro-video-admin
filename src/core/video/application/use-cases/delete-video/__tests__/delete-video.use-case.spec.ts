import { VideoInMemoryRepository } from '@core/video/infra/db/in-memory/video-in-memory.repository';
import { DeleteVideoUseCase } from '../delete-video.use-case';
import {
  InvalidUuidError,
  Uuid,
} from '@core/shared/domain/value-objects/uuid.vo';
import { Video } from '@core/video/domain/video.aggregate';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

describe('DeleteVideoUseCase Unit Tests', () => {
  let useCase: DeleteVideoUseCase;
  let repository: VideoInMemoryRepository;

  beforeEach(() => {
    repository = new VideoInMemoryRepository();
    useCase = new DeleteVideoUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const uuid = new Uuid();

    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Video),
    );
  });

  it('should delete a video', async () => {
    const video = Video.fake().aVideoWithAllMedias().build();
    await repository.insert(video);

    await useCase.execute({
      id: video.video_id.id,
    });

    expect(repository.items).toHaveLength(0);
  });
});
