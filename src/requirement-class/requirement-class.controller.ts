import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequirementClassService } from './requirement-class.service';
import { CreateRequirementClassDto } from './dto/create-requirement-class.dto';
import { UpdateRequirementClassDto } from './dto/update-requirement-class.dto';

@Controller('requirement-class')
export class RequirementClassController {
  constructor(private readonly requirementClassService: RequirementClassService) {}

  @Post()
  create(@Body() createRequirementClassDto: CreateRequirementClassDto) {
    return this.requirementClassService.create(createRequirementClassDto);
  }

  @Get()
  findAll() {
    return this.requirementClassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requirementClassService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequirementClassDto: UpdateRequirementClassDto) {
    return this.requirementClassService.update(+id, updateRequirementClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requirementClassService.remove(+id);
  }
}
