import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreateVideoUseCase } from '@core/video/application/use-cases/create-video/create-video.use-case';
import { UpdateVideoUseCase } from '@core/video/application/use-cases/update-video/update-video.use-case';
import { UploadAudioVideoMediasUseCase } from '@core/video/application/use-cases/upload-audio-video-media/upload-audio-video-medias.use-case';
import { GetVideoUseCase } from '@core/video/application/use-cases/get-video/get-video.use-case';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoOutput } from '@core/video/application/use-cases/common/video-output';
import { VideoPresenter } from './presenter/video.presenter';
import { UpdateVideoInput } from '@core/video/application/use-cases/update-video/update-video.input';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadAudioVideoMediaInput } from '@core/video/application/use-cases/upload-audio-video-media/upload-audio-video-media.input';
import { Upload } from '@google-cloud/storage/build/cjs/src/resumable-upload';

@Controller('videos')
export class VideoController {
  @Inject(CreateVideoUseCase)
  private createUseCase: CreateVideoUseCase;

  @Inject(UpdateVideoUseCase)
  private updatedUseCase: UpdateVideoUseCase;

  @Inject(UploadAudioVideoMediasUseCase)
  private uploadAudioVideoMedia: UploadAudioVideoMediasUseCase;

  @Inject(GetVideoUseCase)
  private getUseCase: GetVideoUseCase;

  @Post()
  async create(@Body() createVideoDto: CreateVideoDto) {
    const { id } = await this.createUseCase.execute(createVideoDto);

    const output = await this.getUseCase.execute({ id });

    return VideoController.serialize(output);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getUseCase.execute({ id });

    return VideoController.serialize(output);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'banner',
        maxCount: 1,
      },
      {
        name: 'thumbnail',
        maxCount: 1,
      },
      {
        name: 'thumbnail_half',
        maxCount: 1,
      },
      {
        name: 'trailer',
        maxCount: 1,
      },
      {
        name: 'video',
        maxCount: 1,
      },
    ]),
  )
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateVideoDto: any,
    @UploadedFiles()
    files: {
      banner?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      thumbnail_half?: Express.Multer.File[];
      trailer?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    const hasFiles = files ? Object.keys(files).length : false;

    const hasData = Object.keys(updateVideoDto).length > 0;

    if (hasFiles && hasData) {
      throw new BadRequestException('Files and data cannot be sent together');
    }

    if (hasData) {
      const data = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(updateVideoDto, {
        metatype: UpdateVideoDto,
        type: 'body',
      });

      const input = new UpdateVideoInput({ id, ...data });

      await this.updatedUseCase.execute(input);
    }

    const hasMoreThanOneFile = Object.keys(files).length > 1;
    if (hasMoreThanOneFile) {
      throw new BadRequestException('Only one file can be sent');
    }

    const hasAudioVideoMedia = files.trailer?.length || files.video?.length;
    const fieldField = Object.keys(files)[0];
    const file = files[fieldField][0];

    if (hasAudioVideoMedia) {
      if (fieldField === 'trailer' || fieldField === 'video') {
        const dto: UploadAudioVideoMediaInput = {
          video_id: id,
          field: fieldField,
          file: {
            raw_name: file.originalname,
            data: file.buffer,
            mime_type: file.mimetype,
            size: file.size,
          },
        };

        const input = await new ValidationPipe({
          errorHttpStatusCode: 422,
        }).transform(dto, {
          metatype: UploadAudioVideoMediaInput,
          type: 'body',
        });

        await this.uploadAudioVideoMedia.execute(input);
      }
    } else {
    }

    const output = await this.getUseCase.execute({ id });

    return VideoController.serialize(output);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'thumbnail_half', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  @Patch(':id/upload')
  async uploadFile(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @UploadedFiles()
    files: {
      banner?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      thumbnail_half?: Express.Multer.File[];
      trailer?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    const hasMoreThanOneFile = Object.keys(files).length > 1;
    if (hasMoreThanOneFile) {
      throw new BadRequestException('Only one file can be sent');
    }

    const hasAudioVideoMedia = files.trailer?.length || files.video?.length;
    const fieldField = Object.keys(files)[0];
    const file = files[fieldField][0];

    if (hasAudioVideoMedia) {
      if (fieldField === 'trailer' || fieldField === 'video') {
        const dto: UploadAudioVideoMediaInput = {
          video_id: id,
          field: fieldField,
          file: {
            raw_name: file.originalname,
            data: file.buffer,
            mime_type: file.mimetype,
            size: file.size,
          },
        };

        const input = await new ValidationPipe({
          errorHttpStatusCode: 422,
        }).transform(dto, {
          metatype: UploadAudioVideoMediaInput,
          type: 'body',
        });

        await this.uploadAudioVideoMedia.execute(input);
      }
    } else {
    }

    const output = await this.getUseCase.execute({ id });

    return VideoController.serialize(output);
  }
  static serialize(output: VideoOutput) {
    return new VideoPresenter(output);
  }
}
