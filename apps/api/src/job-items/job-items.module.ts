import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobItemsService } from './job-items.service';
import { JobItemsController } from './job-items.controller';
import { JobItem } from './entities/job-item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([JobItem])],
    controllers: [JobItemsController],
    providers: [JobItemsService],
    exports: [JobItemsService],
})
export class JobItemsModule { }
