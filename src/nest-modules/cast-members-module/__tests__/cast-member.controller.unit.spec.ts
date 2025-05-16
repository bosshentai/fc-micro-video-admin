import {
  CreateCastMemberOutput,
  CreateCastMemberUseCase,
} from '@core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';
import { CastMembersController } from '../cast-members.controller';
import { CreateCastMemberDto } from '../dto/create-cast-member.dto';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from '../cast-members.presenter';
import {
  UpdateCastMemberOutput,
  UpdateCastMemberUseCase,
} from '@core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case';
import { UpdateCastMemberInput } from '@core/cast-member/application/use-cases/update-cast-member/update-cast-member.input';
import {
  DeleteCastMemberInput,
  DeleteCastMemberUseCase,
} from '@core/cast-member/application/use-cases/delete-cast-member/delete-cast-member.use-case';
import {
  GetCastMemberOutput,
  GetCastMemberUseCase,
} from '@core/cast-member/application/use-cases/get-cast-member/get-cast-member.use-case';
import {
  ListCastMembersOutput,
  ListCastMembersUseCase,
} from '@core/cast-member/application/use-cases/list-cast-members/list-cast-member.use-case';

describe('CastMemberController Unit Tests', () => {
  let controller: CastMembersController;

  beforeEach(async () => {
    controller = new CastMembersController();
  });

  it('should create a new cast member', async () => {
    const output: CreateCastMemberOutput = {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'test',
      type: 1,
      created_at: new Date(),
    };

    const mockCastMemberRepo = {
      insert: jest.fn(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
      castMemberRepo: mockCastMemberRepo,
    };

    controller['createUseCase'] =
      mockCreateUseCase as unknown as CreateCastMemberUseCase;

    const input: CreateCastMemberDto = {
      name: 'test',
      type: 1,
    };

    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(output));
  });

  it('should updates a cast member', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: UpdateCastMemberOutput = {
      id,
      name: 'test',
      type: 1,
      created_at: new Date(),
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['updateUseCase'] =
      mockUpdateUseCase as unknown as UpdateCastMemberUseCase;

    const input: Omit<UpdateCastMemberInput, 'id'> = {
      name: 'test',
      type: 1,
    };

    const presenter = await controller.update(id, input);

    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });

    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(output));
  });

  it('should deletes a cast member', async () => {
    const expectedOutput = undefined;

    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    controller['deleteUseCase'] =
      mockDeleteUseCase as unknown as DeleteCastMemberUseCase;

    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';

    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should gets a cast member', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: GetCastMemberOutput = {
      id,
      name: 'test',
      type: 1,
      created_at: new Date(),
    };

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['getUseCase'] =
      mockGetUseCase as unknown as GetCastMemberUseCase;

    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });

    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(output));
  });

  it('should list cast members', async () => {
    const output: ListCastMembersOutput = {
      items: [
        {
          id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'test',
          type: 1,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      per_page: 15,
      last_page: 1,
      total: 1,
    };

    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['listUseCase'] =
      mockListUseCase as unknown as ListCastMembersUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      filter: { name: 'test' },
      sort: 'name',
      sort_dir: 'des',
    };

    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(CastMemberCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new CastMemberCollectionPresenter(output));
  });
});
