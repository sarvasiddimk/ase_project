import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ServiceJobsModule } from './service-jobs/service-jobs.module';
import { JobItemsModule } from './job-items/job-items.module';
import { InvoicesModule } from './invoices/invoices.module';
import { OrdersModule } from './orders/orders.module';
import { InventoryModule } from './inventory/inventory.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { BusinessProfileModule } from './business-profile/business-profile.module';

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
    JobItemsModule,
    InvoicesModule,
    OrdersModule, // Added OrdersModule here
    InventoryModule,
    SchedulingModule,
    BusinessProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
