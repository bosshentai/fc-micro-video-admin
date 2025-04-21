import { Trailer } from './../../../../domain/value-object/trailer.vo';
import { setupSequelizeForVideo } from '../testing/helpers';
import { DataType } from 'sequelize-typescript';
import { VideoModel } from '../video.model';
import { ImageMediaModel, ImageMediaRelatedField } from '../image-media.model';
import {
  AudioVideoMediaModel,
  AudioVideoMediaRelatedField,
} from '../audio-video-media.model';
import { VideoCategoryModel } from '../video-category.model';
import { VideoGenreModel } from '../video-genre.model';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { GenreModel } from '@core/genre/infra/db/sequelize/genre-model';
import { VideoCastMemberModel } from '../video-cast-member.model';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { Category } from '@core/category/domain/category.aggregate';
import { GenreSequelizeRepository } from '@core/genre/infra/db/sequelize/genre-sequelize.repository';
import { UnitOfWorkFakeInMemory } from '@core/shared/infra/db/in-memory/fake-unit-of-work-in-memory';
import { Genre } from '@core/genre/domain/genre.aggregate';
import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';
import { VideoId } from '@core/video/domain/video.aggregate';
import { RatingValues } from '@core/video/domain/value-object/rating.vo';
import { AudioVideoMediaStatus } from '@core/shared/domain/value-objects/audio-video-media.vo';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
describe('VideoModel Unit Tests', () => {
  setupSequelizeForVideo();

  test('table name', () => {
    expect(VideoModel.tableName).toBe('videos');
  });

  test('mapping props', () => {
    const attributesMap = VideoModel.getAttributes();
    const attributes = Object.keys(VideoModel.getAttributes());
    expect(attributes).toStrictEqual([
      'video_id',
      'title',
      'description',
      'year_launched',
      'duration',
      'rating',
      'is_opened',
      'is_published',
      'created_at',
    ]);

    const videoIdAttr = attributesMap.video_id;
    expect(videoIdAttr).toMatchObject({
      field: 'video_id',
      fieldName: 'video_id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const titleAttr = attributesMap.title;
    expect(titleAttr).toMatchObject({
      field: 'title',
      fieldName: 'title',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const descriptionAttr = attributesMap.description;
    expect(descriptionAttr).toMatchObject({
      field: 'description',
      fieldName: 'description',
      allowNull: false,
      type: DataType.TEXT(),
    });

    const yearLaunchedAttr = attributesMap.year_launched;
    expect(yearLaunchedAttr).toMatchObject({
      field: 'year_launched',
      fieldName: 'year_launched',
      allowNull: false,
      type: DataType.INTEGER(),
    });

    const durationAttr = attributesMap.duration;
    expect(durationAttr).toMatchObject({
      field: 'duration',
      fieldName: 'duration',
      allowNull: false,
      type: DataType.INTEGER(),
    });

    const ratingAttr = attributesMap.rating;
    expect(ratingAttr).toMatchObject({
      field: 'rating',
      fieldName: 'rating',
      allowNull: false,
      type: DataType.ENUM('L', '10', '12', '14', '16', '18'),
    });

    const isOpenedAttr = attributesMap.is_opened;
    expect(isOpenedAttr).toMatchObject({
      field: 'is_opened',
      fieldName: 'is_opened',
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    const isPublishedAttr = attributesMap.is_published;
    expect(isPublishedAttr).toMatchObject({
      field: 'is_published',
      fieldName: 'is_published',
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    const createdAtAttr = attributesMap['created_at'];
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      allowNull: false,
      type: DataType.DATE(6),
    });
  });

  test('mapping associations', () => {
    const associationsMap = VideoModel.associations;
    const associations = Object.keys(associationsMap);
    expect(associations).toStrictEqual([
      'image_medias',
      'audio_video_medias',
      'categories_id',
      'categories',
      'genres_id',
      'genres',
      'cast_members_id',
      'cast_members',
    ]);
    const imageMediasAttr = associationsMap.image_medias;
    expect(imageMediasAttr).toMatchObject({
      foreignKey: 'video_id',
      source: VideoModel,
      target: ImageMediaModel,
      associationType: 'HasMany',
      options: {
        foreignKey: {
          name: 'video_id',
        },
      },
    });

    const audioVideoMediasAttr = associationsMap.audio_video_medias;
    expect(audioVideoMediasAttr).toMatchObject({
      foreignKey: 'video_id',
      source: VideoModel,
      target: AudioVideoMediaModel,
      associationType: 'HasMany',
      options: {
        foreignKey: {
          name: 'video_id',
        },
      },
    });

    const categoriesIdAttr = associationsMap.categories_id;
    expect(categoriesIdAttr).toMatchObject({
      foreignKey: 'video_id',
      source: VideoModel,
      target: VideoCategoryModel,
      associationType: 'HasMany',
      options: {
        foreignKey: {
          name: 'video_id',
        },
        as: 'categories_id',
      },
    });

    const categoriesRelation = associationsMap.categories;
    expect(categoriesRelation).toMatchObject({
      associationType: 'BelongsToMany',
      source: VideoModel,
      target: CategoryModel,
      options: {
        through: { model: VideoCategoryModel },
        foreignKey: { name: 'video_id' },
        otherKey: { name: 'category_id' },
        as: 'categories',
      },
    });

    const genresIdAttr = associationsMap.genres_id;
    expect(genresIdAttr).toMatchObject({
      foreignKey: 'video_id',
      source: VideoModel,
      target: VideoGenreModel,
      associationType: 'HasMany',
      options: {
        foreignKey: {
          name: 'video_id',
        },
        as: 'genres_id',
      },
    });

    const genresRelation = associationsMap.genres;
    expect(genresRelation).toMatchObject({
      associationType: 'BelongsToMany',
      source: VideoModel,
      target: GenreModel,
      options: {
        through: { model: VideoGenreModel },
        foreignKey: { name: 'video_id' },
        otherKey: { name: 'genre_id' },
        as: 'genres',
      },
    });

    const castMembersIdAttr = associationsMap.cast_members_id;
    expect(castMembersIdAttr).toMatchObject({
      foreignKey: 'video_id',
      source: VideoModel,
      target: VideoCastMemberModel,
      associationType: 'HasMany',
      options: {
        foreignKey: {
          name: 'video_id',
        },
        as: 'cast_members_id',
      },
    });

    const castMembersRelation = associationsMap.cast_members;
    expect(castMembersRelation).toMatchObject({
      associationType: 'BelongsToMany',
      source: VideoModel,
      target: CastMemberModel,
      options: {
        through: { model: VideoCastMemberModel },
        foreignKey: { name: 'video_id' },
        otherKey: { name: 'cast_member_id' },
        as: 'cast_members',
      },
    });
  });

  test('create and association relations separately', async () => {
    const categoryRepo = new CategorySequelizeRepository(CategoryModel);
    const category = Category.fake().aCategory().build();

    await categoryRepo.insert(category);

    const genreRepo = new GenreSequelizeRepository(
      GenreModel,
      new UnitOfWorkFakeInMemory() as any,
    );

    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(genre);

    const castMemberRepo = new CastMemberSequelizeRepository(CastMemberModel);

    const castMember = CastMember.fake().anActor().build();
    await castMemberRepo.insert(castMember);

    const videoProps = {
      video_id: new VideoId().id,
      title: 'title',
      description: 'description',
      year_launched: 2025,
      duration: 90,
      rating: RatingValues.R10,
      is_opened: false,
      is_published: false,
      created_at: new Date(),
    };

    const video = await VideoModel.create(videoProps as any);

    await video.$add('categories', [category.category_id.id]);
    const videoWithCatgories = await VideoModel.findByPk(video.video_id, {
      include: ['categories_id'],
    });
    expect(videoWithCatgories).toMatchObject(videoProps);
    expect(videoWithCatgories!.categories_id).toHaveLength(1);
    expect(videoWithCatgories!.categories_id[0]).toBeInstanceOf(
      VideoCategoryModel,
    );
    expect(videoWithCatgories!.categories_id[0].category_id).toBe(
      category.category_id.id,
    );
    expect(videoWithCatgories!.categories_id[0].video_id).toBe(video.video_id);

    await video.$add('genres', [genre.genre_id.id]);

    const videoWithGenres = await VideoModel.findByPk(video.video_id, {
      include: ['genres_id'],
    });

    expect(videoWithGenres).toMatchObject(videoProps);
    expect(videoWithGenres!.genres_id).toHaveLength(1);
    expect(videoWithGenres!.genres_id[0]).toBeInstanceOf(VideoGenreModel);
    expect(videoWithGenres!.genres_id[0].genre_id).toBe(genre.genre_id.id);
    expect(videoWithGenres!.genres_id[0].video_id).toBe(video.video_id);

    await video.$add('cast_members', [castMember.cast_member_id.id]);

    const videoWithCastMembers = await VideoModel.findByPk(video.video_id, {
      include: ['cast_members_id'],
    });
    expect(videoWithCastMembers).toMatchObject(videoProps);
    expect(videoWithCastMembers!.cast_members_id).toHaveLength(1);
    expect(videoWithCastMembers!.cast_members_id[0]).toBeInstanceOf(
      VideoCastMemberModel,
    );
    expect(videoWithCastMembers!.cast_members_id[0].cast_member_id).toBe(
      castMember.cast_member_id.id,
    );
    expect(videoWithCastMembers!.cast_members_id[0].video_id).toBe(
      video.video_id,
    );

    await video.$create('image_media', {
      name: 'name',
      location: 'original_name',
      video_related_field: ImageMediaRelatedField.BANNER,
    });

    const videoWithImageMedias = await VideoModel.findByPk(video.video_id, {
      include: ['image_medias'],
    });

    expect(videoWithImageMedias).toMatchObject(videoProps);
    expect(videoWithImageMedias!.image_medias).toHaveLength(1);
    expect(videoWithImageMedias!.image_medias[0].toJSON()).toMatchObject({
      name: 'name',
      location: 'original_name',
      video_id: video.video_id,
      video_related_field: ImageMediaRelatedField.BANNER,
    });

    await video.$create('audio_video_media', {
      name: 'name',
      raw_location: 'location',
      video_related_field: ImageMediaRelatedField.BANNER,
      status: AudioVideoMediaStatus.COMPLETED,
    });

    const videoWithAudioVideoMedias = await VideoModel.findByPk(
      video.video_id,
      {
        include: ['audio_video_medias'],
      },
    );
    expect(videoWithAudioVideoMedias).toMatchObject(videoProps);
    expect(videoWithAudioVideoMedias!.audio_video_medias).toHaveLength(1);
    expect(
      videoWithAudioVideoMedias!.audio_video_medias[0].toJSON(),
    ).toMatchObject({
      name: 'name',
      raw_location: 'location',
      video_id: video.video_id,
      video_related_field: ImageMediaRelatedField.BANNER,
      status: AudioVideoMediaStatus.COMPLETED,
    });
  });

  test('create and association in single transaction', async () => {
    const categoryRepo = new CategorySequelizeRepository(CategoryModel);
    const category = Category.fake().aCategory().build();
    await categoryRepo.insert(category);

    const genreRepo = new GenreSequelizeRepository(
      GenreModel,
      new UnitOfWorkFakeInMemory() as any,
    );

    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();

    await genreRepo.insert(genre);

    const castMemberRepo = new CastMemberSequelizeRepository(CastMemberModel);
    const castMember = CastMember.fake().anActor().build();
    await castMemberRepo.insert(castMember);

    const videoProps = {
      video_id: new VideoId().id,
      title: 'title',
      description: 'description',
      year_launched: 2025,
      duration: 90,
      rating: RatingValues.R10,
      is_opened: false,
      is_published: false,
      created_at: new Date(),
    };

    const video = await VideoModel.create(
      {
        ...videoProps,
        categories_id: [
          VideoCategoryModel.build({
            category_id: category.category_id.id,
            video_id: videoProps.video_id,
          }),
        ],
        genres_id: [
          VideoGenreModel.build({
            genre_id: genre.genre_id.id,
            video_id: videoProps.video_id,
          }),
        ],
        cast_members_id: [
          VideoCastMemberModel.build({
            cast_member_id: castMember.cast_member_id.id,
            video_id: videoProps.video_id,
          }),
        ],
        image_medias: [
          ImageMediaModel.build({
            video_id: videoProps.video_id,
            image_media_id: new Uuid().id,
            name: 'name',
            location: 'original_name',
            video_related_field: ImageMediaRelatedField.BANNER,
          }),
        ],
        audio_video_medias: [
          AudioVideoMediaModel.build({
            video_id: videoProps.video_id,
            audio_video_media_id: new Uuid().id,
            name: 'name',
            raw_location: 'location',
            video_related_field: AudioVideoMediaRelatedField.TRAILER,
            status: AudioVideoMediaStatus.COMPLETED,
          }),
        ],
      },
      {
        include: [
          'categories_id',
          'genres_id',
          'cast_members_id',
          'image_medias',
          'audio_video_medias',
        ],
      },
    );

    const videoWithRelations = await VideoModel.findByPk(video.video_id, {
      include: [
        'categories_id',
        'genres_id',
        'cast_members_id',
        'image_medias',
        'audio_video_medias',
      ],
    });

    expect(videoWithRelations).toMatchObject(videoProps);
    expect(videoWithRelations!.categories_id).toHaveLength(1);
    expect(videoWithRelations!.categories_id[0]).toBeInstanceOf(
      VideoCategoryModel,
    );
    expect(videoWithRelations!.categories_id[0].category_id).toBe(
      category.category_id.id,
    );
    expect(videoWithRelations!.categories_id[0].video_id).toBe(video.video_id);
    expect(videoWithRelations!.genres_id).toHaveLength(1);
    expect(videoWithRelations!.genres_id[0]).toBeInstanceOf(VideoGenreModel);
    expect(videoWithRelations!.genres_id[0].genre_id).toBe(genre.genre_id.id);
    expect(videoWithRelations!.genres_id[0].video_id).toBe(video.video_id);
    expect(videoWithRelations!.cast_members_id).toHaveLength(1);
    expect(videoWithRelations!.cast_members_id[0]).toBeInstanceOf(
      VideoCastMemberModel,
    );
    expect(videoWithRelations!.cast_members_id[0].cast_member_id).toBe(
      castMember.cast_member_id.id,
    );
    expect(videoWithRelations!.cast_members_id[0].video_id).toBe(
      video.video_id,
    );
    expect(videoWithRelations!.image_medias).toHaveLength(1);
    expect(videoWithRelations!.image_medias[0]).toBeInstanceOf(ImageMediaModel);
    expect(videoWithRelations!.image_medias[0].video_id).toBe(video.video_id);
    expect(videoWithRelations!.image_medias[0].toJSON()).toMatchObject({
      name: 'name',
      location: 'original_name',
      video_id: video.video_id,
      video_related_field: ImageMediaRelatedField.BANNER,
    });
    expect(videoWithRelations!.audio_video_medias).toHaveLength(1);
    expect(videoWithRelations!.audio_video_medias[0]).toBeInstanceOf(
      AudioVideoMediaModel,
    );
    expect(videoWithRelations!.audio_video_medias[0].video_id).toBe(
      video.video_id,
    );
    expect(videoWithRelations!.audio_video_medias[0].toJSON()).toMatchObject({
      name: 'name',
      raw_location: 'location',
      video_id: video.video_id,
      video_related_field: AudioVideoMediaRelatedField.TRAILER,
      status: AudioVideoMediaStatus.COMPLETED,
    });
  });
});
