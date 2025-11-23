import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceJobsService } from './service-jobs.service';
import { ServiceJobsController } from './service-jobs.controller';
import { ServiceJob } from './entities/service-job.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ServiceJob])],
    controllers: [ServiceJobsController],
    providers: [ServiceJobsService],
    exports: [ServiceJobsService],
})
export class ServiceJobsModule { }
