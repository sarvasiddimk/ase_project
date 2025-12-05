import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order.entity';
import { Supplier } from './entities/supplier.entity';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, Supplier]),
        InventoryModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule implements OnModuleInit {
    constructor(private readonly ordersService: OrdersService) { }

    async onModuleInit() {
        await this.ordersService.seedSuppliers();
    }
}
