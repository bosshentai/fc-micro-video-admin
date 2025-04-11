import { IDomainEvent } from '@core/shared/domain/events/domain-event.internface';
import { ValueObject } from '@core/shared/domain/value-object';
import { VideoId } from '../video.aggregate';
import { VideoMedia } from '../value-object/video-media.vo';
import { Trailer } from '../value-object/trailer.vo';

type VideoAudioMediaReplacedProps = {
  aggregate_id: VideoId;
  media: Trailer | VideoMedia;
  media_type: 'trailer' | 'video';
};

export class VideoAudioMediaReplaced implements IDomainEvent {
  aggregate_id: VideoId;
  occurred_on: Date;
  event_version: number;

  readonly media: Trailer | VideoMedia;
  readonly media_type: 'trailer' | 'video';

  constructor(props: VideoAudioMediaReplacedProps) {
    this.aggregate_id = props.aggregate_id;
    this.media = props.media;
    this.media_type = props.media_type;
    this.occurred_on = new Date();
    this.event_version = 1;
  }
}
