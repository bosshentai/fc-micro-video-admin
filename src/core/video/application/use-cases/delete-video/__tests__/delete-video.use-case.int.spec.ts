import { VideoSequelizeRepository } from '@core/video/infra/db/sequelize/video-sequelize.repository';
import { DeleteVideoUseCase } from '../delete-video.use-case';
import { setupSequelizeForVideo } from '@core/video/infra/db/sequelize/testing/helpers';
import { VideoModel } from '@core/video/infra/db/sequelize/video.model';
import { UnitOfWorkSequelize } from '@core/shared/infra/db/sequelize/unit-of-work-sequelize';
import { Video, VideoId } from '@core/video/domain/video.aggregate';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { GenreSequelizeRepository } from '@core/genre/infra/db/sequelize/genre-sequelize.repository';
import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize';
import { CategoriesIdExistsInDatabaseValidator } from '@core/category/application/validations/categories-ids-exists-in-database.validator';
import { GenresIdExistsInDatabaseValidator } from '@core/genre/application/validations/genres-ids-exists-in-database.validator';
import { CastMembersIdExistsInDatabaseValidator } from '@core/cast-member/application/valitations/cast-members-ids-exists-in-database.validator';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { GenreModel } from '@core/genre/infra/db/sequelize/genre-model';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { Category, CategoryId } from '@core/category/domain/category.aggregate';
import { Genre, GenreId } from '@core/genre/domain/genre.aggregate';
import {
  CastMember,
  CastMemberId,
} from '@core/cast-member/domain/cast-member.aggregate';

describe('DeleteVideoUseCase Integration Tests', () => {
  let useCase: DeleteVideoUseCase;

  let videoRepo: VideoSequelizeRepository;
  let genreRepo: GenreSequelizeRepository;
  let castMemberRepo: CastMemberSequelizeRepository;

  let categoryRepo: CategorySequelizeRepository;
  let categoriesIdsValidator: CategoriesIdExistsInDatabaseValidator;
  let genresIdsValidator: GenresIdExistsInDatabaseValidator;
  let castMembersIdsValidator: CastMembersIdExistsInDatabaseValidator;

  const sequeliezeHelper = setupSequelizeForVideo();

  beforeEach(() => {
    let uow = new UnitOfWorkSequelize(sequeliezeHelper.sequelize);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    castMemberRepo = new CastMemberSequelizeRepository(CastMemberModel);
    categoriesIdsValidator = new CategoriesIdExistsInDatabaseValidator(
      categoryRepo,
    );
    genresIdsValidator = new GenresIdExistsInDatabaseValidator(genreRepo);
    castMembersIdsValidator = new CastMembersIdExistsInDatabaseValidator(
      castMemberRepo,
    );
    videoRepo = new VideoSequelizeRepository(VideoModel, uow);
    useCase = new DeleteVideoUseCase(videoRepo);
  });

  it('should throws error when entity not found', async () => {
    const videoId = new VideoId();
    await expect(() => useCase.execute({ id: videoId.id })).rejects.toThrow(
      new NotFoundError(videoId.id, Video),
    );
  });

  it('should delete a video', async () => {
    const categories = Category.fake().theCategories(2).build();
    await categoryRepo.bulkInsert(categories);
    const categoriesId = categories.map((c) => c.category_id.id);

    const genres = Genre.fake().theGenres(2).build();
    genres[0].syncCategoriesId([categories[0].category_id]);
    genres[1].syncCategoriesId([categories[1].category_id]);
    await genreRepo.bulkInsert(genres);
    const genresId = genres.map((c) => c.genre_id.id);

    const castMembers = CastMember.fake().theCastMembers(2).build();
    await castMemberRepo.bulkInsert(castMembers);
    const castMembersId = castMembers.map((c) => c.cast_member_id.id);

    const video = Video.fake()
      .aVideoWithoutMedias()
      .addCategoryId(new CategoryId(categoriesId[0]))
      .addGenreId(new GenreId(genresId[0]))
      .addCastMemberId(new CastMemberId(castMembersId[0]))
      .addCastMemberId(new CastMemberId(castMembersId[1]))
      .build();

    await videoRepo.insert(video);

    await useCase.execute({
      id: video.video_id.id,
    });

    const videos = await videoRepo.findAll();
    expect(videos.length).toBe(0);
  });
});
