import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common/decorators';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryRepo: CategorySequelizeRepository) {
    // console.log(categoryRepo);
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    // return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    // return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    // return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.categoriesService.remove(+id);
  }
}
