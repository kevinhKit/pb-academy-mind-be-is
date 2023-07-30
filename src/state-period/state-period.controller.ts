import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StatePeriodService } from './state-period.service';
import { CreateStatePeriodDto } from './dto/create-state-period.dto';
import { UpdateStatePeriodDto } from './dto/update-state-period.dto';

@Controller('state-period')
export class StatePeriodController {
  constructor(private readonly statePeriodService: StatePeriodService) {}

  @Post()
  create(@Body() createStatePeriodDto: CreateStatePeriodDto) {
    return this.statePeriodService.create(createStatePeriodDto);
  }

  @Get()
  findAll() {
    return this.statePeriodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statePeriodService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStatePeriodDto: UpdateStatePeriodDto,
  ) {
    return this.statePeriodService.update(+id, updateStatePeriodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statePeriodService.remove(+id);
  }
}
