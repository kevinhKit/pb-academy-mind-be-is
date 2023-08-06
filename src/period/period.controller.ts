import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PeriodService } from './period.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { UpdatePeriodCancelationDto } from './dto/update-period-cancelation.dt';

@Controller('period')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  @Post()
  create(@Body() createPeriodDto: CreatePeriodDto) {
    return this.periodService.create(createPeriodDto);
  }

  @Get()
  findAll() {
    return this.periodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.periodService.findOne(+id);
  }

  @Get('year/:id')
  findByYear(@Param('id') id: string) {
    return this.periodService.findByYear(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePeriodDto: UpdatePeriodDto) {
    return this.periodService.update(+id, updatePeriodDto);
  }

  @Patch('cancelations/:id')
  updateCancelations(
    @Param('id') id: string,
    @Body() updatePeriodCancelationDto: UpdatePeriodCancelationDto,
  ) {
    return this.periodService.updateCancelations(
      +id,
      updatePeriodCancelationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.periodService.remove(+id);
  }
}
