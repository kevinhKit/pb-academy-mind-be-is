import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExceptionalCancellationService } from './exceptional-cancellation.service';
import { CreateExceptionalCancellationDto } from './dto/create-exceptional-cancellation.dto';
import { UpdateExceptionalCancellationDto } from './dto/update-exceptional-cancellation.dto';

@Controller('exceptional-cancellation')
export class ExceptionalCancellationController {
  constructor(private readonly exceptionalCancellationService: ExceptionalCancellationService) {}

  @Post()
  create(@Body() createExceptionalCancellationDto: CreateExceptionalCancellationDto) {
    return this.exceptionalCancellationService.create(createExceptionalCancellationDto);
  }

  @Get()
  findAll() {
    return this.exceptionalCancellationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exceptionalCancellationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExceptionalCancellationDto: UpdateExceptionalCancellationDto) {
    return this.exceptionalCancellationService.update(+id, updateExceptionalCancellationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exceptionalCancellationService.remove(+id);
  }
}
