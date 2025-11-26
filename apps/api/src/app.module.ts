import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ServiceJobsModule } from './service-jobs/service-jobs.module';
import { JobItemsModule } from './job-items/job-items.module';
import { InvoicesModule } from './invoices/invoices.module';
import { InventoryModule } from './inventory/inventory.module';
import { SchedulingModule } from './scheduling/scheduling.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'ase.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CustomersModule,
    VehiclesModule,
    ServiceJobsModule,
    ServiceJobsModule,
    JobItemsModule,
    InvoicesModule,
    InventoryModule,
    SchedulingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
