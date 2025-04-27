import { IsIn, IsNotEmpty, IsString, validateSync } from 'class-validator';
import { FileMediaInput } from '../common/file-media.input';

export type UploadImageMediasInputConstructorProps = {
  video_id: string;
  field: string;
  file: FileMediaInput;
};

export class UploadImageMediaInput {
  @IsString()
  @IsNotEmpty()
  video_id: string;

  @IsIn(['banner', 'thumbnail', 'thumbnail_half'])
  @IsNotEmpty()
  field: 'banner' | 'thumbnail' | 'thumbnail_half';

  file: FileMediaInput;

  //TODO: change the to use UploadImageMediaInputConstructorProps
  constructor(props: UploadImageMediaInput) {
    if (!props) return;
    this.video_id = props.video_id;
    this.field = props.field;
    this.file = props.file;
  }
}

export class ValidateUploadImageMediaInput {
  static validate(input: UploadImageMediaInput) {
    return validateSync(input);
  }
}
