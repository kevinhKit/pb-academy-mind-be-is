import { Module } from '@nestjs/common';
import { ExceptionalCancellationService } from './exceptional-cancellation.service';
import { ExceptionalCancellationController } from './exceptional-cancellation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExceptionalCancellation } from './entities/exceptional-cancellation.entity';

@Module({
  controllers: [ExceptionalCancellationController],
  providers: [ExceptionalCancellationService],
  imports: [TypeOrmModule.forFeature([ExceptionalCancellation])]
})
export class ExceptionalCancellationModule {}
