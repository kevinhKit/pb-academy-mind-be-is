import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RepositionRequestService } from './reposition-request.service';
import { CreateRepositionRequestDto } from './dto/create-reposition-request.dto';
import { UpdateRepositionRequestDto } from './dto/update-reposition-request.dto';
import { Student } from 'src/student/entities/student.entity';

@Controller('reposition-request')
export class RepositionRequestController {
  constructor(
    private readonly repositionRequestService: RepositionRequestService,
  ) {}

  @Post()
  create(@Body() createRepositionRequestDto: CreateRepositionRequestDto) {
    return this.repositionRequestService.create(createRepositionRequestDto);
  }

  @Get()
  findAll() {
    return this.repositionRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Student) {
    return this.repositionRequestService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRepositionRequestDto: UpdateRepositionRequestDto,
  ) {
    return this.repositionRequestService.update(
      +id,
      updateRepositionRequestDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repositionRequestService.remove(+id);
  }
}
