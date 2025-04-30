import { IUseCase } from '@core/shared/application/use-case.interface';
import { VideoId } from '@core/video/domain/video.aggregate';
import { IVideoRepository } from '@core/video/domain/video.repository';

export class DeleteVideoUseCase
  implements IUseCase<DeleteVideoInput, DeleteVideoOutput>
{
  constructor(private videoRepo: IVideoRepository) {}

  async execute(input: DeleteVideoInput): Promise<void> {
    const uuid = new VideoId(input.id);

    await this.videoRepo.delete(uuid);
  }
}

export type DeleteVideoInput = {
  id: string;
};

type DeleteVideoOutput = void;
