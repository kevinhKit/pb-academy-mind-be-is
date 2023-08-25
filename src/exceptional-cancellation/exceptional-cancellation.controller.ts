import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { ExceptionalCancellationService } from './exceptional-cancellation.service';
import { CreateExceptionalCancellationDto } from './dto/create-exceptional-cancellation.dto';
import { UpdateExceptionalCancellationDto } from './dto/update-exceptional-cancellation.dto';
import { Student } from 'src/student/entities/student.entity';
import { Career } from 'src/career/entities/career.entity';
import { RegionalCenter } from 'src/regional-center/entities/regional-center.entity';

@Controller('exceptional-cancellation')
export class ExceptionalCancellationController {
  constructor(
    private readonly exceptionalCancellationService: ExceptionalCancellationService,
  ) {}

  @Post()
  create(
    @Body() createExceptionalCancellationDto: CreateExceptionalCancellationDto,
  ) {
    return this.exceptionalCancellationService.create(
      createExceptionalCancellationDto,
    );
  }

  @Get('by-carrer/:id')
  findByCareer(
    @Param('id') id: Career,
    @Query('center') centerId: RegionalCenter,
  ) {
    return this.exceptionalCancellationService.findByCareer(id, centerId);
  }

  @Get('cancelation-tuitions/:id')
  findCancelationTuitions(@Param('id') id: Student) {
    return this.exceptionalCancellationService.findCancelationTuitions(id);
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
  update(
    @Param('id') id: string,
    @Body() updateExceptionalCancellationDto: UpdateExceptionalCancellationDto,
  ) {
    return this.exceptionalCancellationService.update(
      id,
      updateExceptionalCancellationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exceptionalCancellationService.remove(+id);
  }
}
