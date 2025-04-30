import { IVideoRepository } from '@core/video/domain/video.repository';

export class ListVideoUseCase {
  constructor(private videoRepo: IVideoRepository) {}
}
