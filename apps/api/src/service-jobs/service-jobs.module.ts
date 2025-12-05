import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceJobsService } from './service-jobs.service';
import { ServiceJobsController } from './service-jobs.controller';
import { ServiceJob } from './entities/service-job.entity';

import { Appointment } from '../scheduling/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceJob, Appointment])],
  controllers: [ServiceJobsController],
  providers: [ServiceJobsService],
  exports: [ServiceJobsService],
})
export class ServiceJobsModule { }
