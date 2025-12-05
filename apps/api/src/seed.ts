import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomersService } from './customers/customers.service';
import { VehiclesService } from './vehicles/vehicles.service';
import { ServiceJobsService } from './service-jobs/service-jobs.service';
import { InventoryService } from './inventory/inventory.service';
import { SchedulingService } from './scheduling/scheduling.service';
import { OrdersService } from './orders/orders.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const customersService = app.get(CustomersService);
  const vehiclesService = app.get(VehiclesService);
  const serviceJobsService = app.get(ServiceJobsService);
  const inventoryService = app.get(InventoryService);
  const schedulingService = app.get(SchedulingService);

  console.log('🌱 Seeding database...');

  // Create Customers
  const customer1 = await customersService.create({
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '555-0101',
    address: '123 Main St, Springfield',
  });

  const customer2 = await customersService.create({
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '555-0102',
    address: '456 Oak Ave, Springfield',
  });

  const customer3 = await customersService.create({
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    phone: '555-0103',
    address: '789 Pine Rd, Springfield',
  });

  console.log('✅ Created 3 customers');

  // Create Vehicles
  const vehicle1 = await vehiclesService.create({
    customerId: customer1.id,
    vin: 'VIN123456789',
    make: 'Honda',
    model: 'Civic',
    year: 2018,
  });

  const vehicle2 = await vehiclesService.create({
    customerId: customer2.id,
    vin: 'VIN987654321',
    make: 'Ford',
    model: 'F-150',
    year: 2020,
  });

  const vehicle3 = await vehiclesService.create({
    customerId: customer3.id,
    vin: 'VIN555666777',
    make: 'Toyota',
    model: 'Camry',
    year: 2019,
  });

  console.log('✅ Created 3 vehicles');

  // Create Service Jobs
  await serviceJobsService.create({
    customerId: customer1.id,
    vehicleId: vehicle1.id,
    description: 'Oil Change & Brake Inspection',
  });

  await serviceJobsService.create({
    customerId: customer2.id,
    vehicleId: vehicle2.id,
    description: 'Check Engine Light Diagnosis',
  });

  await serviceJobsService.create({
    customerId: customer3.id,
    vehicleId: vehicle3.id,
    description: 'Tire Rotation',
  });

  console.log('✅ Created 3 service jobs');

  // Create Inventory Items
  await inventoryService.create({
    sku: 'OIL-5W30',
    name: 'Synthetic Oil 5W-30',
    description: 'Premium synthetic motor oil',
    quantityOnHand: 45,
    reorderLevel: 20,
    costPrice: 6.5,
    sellPrice: 8.5,
    location: 'A1',
  });

  await inventoryService.create({
    sku: 'FLT-OIL-01',
    name: 'Oil Filter Type A',
    description: 'Standard oil filter',
    quantityOnHand: 12,
    reorderLevel: 15,
    costPrice: 8.0,
    sellPrice: 12.0,
    location: 'B2',
  });

  await inventoryService.create({
    sku: 'BRK-PAD-F',
    name: 'Front Brake Pads',
    description: 'Ceramic brake pads',
    quantityOnHand: 8,
    reorderLevel: 10,
    costPrice: 35.0,
    sellPrice: 45.0,
    location: 'C3',
  });

  await inventoryService.create({
    sku: 'WIP-22',
    name: 'Wiper Blade 22"',
    description: 'All-weather wiper blade',
    quantityOnHand: 30,
    reorderLevel: 10,
    costPrice: 12.0,
    sellPrice: 18.0,
    location: 'D4',
  });

  console.log('✅ Created 4 inventory items');

  // Create Appointments
  const today = new Date();
  today.setHours(9, 0, 0, 0);

  await schedulingService.create({
    customerId: customer1.id,
    vehicleId: vehicle1.id,
    startTime: new Date(today).toISOString(),
    endTime: new Date(today.getTime() + 90 * 60 * 1000).toISOString(),
    notes: 'Oil Change',
  });

  const appointment2Time = new Date(today);
  appointment2Time.setHours(11, 0, 0, 0);
  await schedulingService.create({
    customerId: customer2.id,
    vehicleId: vehicle2.id,
    startTime: appointment2Time.toISOString(),
    endTime: new Date(
      appointment2Time.getTime() + 120 * 60 * 1000,
    ).toISOString(),
    notes: 'Brake Service',
  });

  const appointment3Time = new Date(today);
  appointment3Time.setHours(14, 0, 0, 0);
  await schedulingService.create({
    customerId: customer3.id,
    vehicleId: vehicle3.id,
    startTime: appointment3Time.toISOString(),
    endTime: new Date(
      appointment3Time.getTime() + 60 * 60 * 1000,
    ).toISOString(),
    notes: 'Tire Rotation',
  });

  console.log('✅ Created 3 appointments');

  // Create Suppliers
  const ordersService = app.get(OrdersService);
  await ordersService.seedSuppliers();
  console.log('✅ Created suppliers');

  console.log('🎉 Database seeded successfully!');
  await app.close();
}

void bootstrap();
