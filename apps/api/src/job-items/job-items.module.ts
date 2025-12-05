import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobItemsService } from './job-items.service';
import { JobItemsController } from './job-items.controller';
import { JobItem } from './entities/job-item.entity';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobItem]),
    InventoryModule,
  ],
  controllers: [JobItemsController],
  providers: [JobItemsService],
  exports: [JobItemsService],
})
export class JobItemsModule { }
