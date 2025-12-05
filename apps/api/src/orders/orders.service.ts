import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Supplier } from './entities/supplier.entity';
import { InventoryService } from '../inventory/inventory.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(Supplier)
        private suppliersRepository: Repository<Supplier>,
        private inventoryService: InventoryService,
    ) { }

    async create(createOrderDto: CreateOrderDto) {
        const supplier = await this.suppliersRepository.findOne({ where: { id: createOrderDto.supplierId } });
        if (!supplier) throw new NotFoundException('Supplier not found');

        const order = this.ordersRepository.create({
            supplier,
            status: OrderStatus.ORDERED,
            items: createOrderDto.items.map(item => ({
                quantity: item.quantity,
                costPrice: item.costPrice,
                inventoryItem: { id: item.inventoryItemId } as any
            }))
        });

        return this.ordersRepository.save(order);
    }

    findAll() {
        return this.ordersRepository.find({
            relations: ['supplier', 'items', 'items.inventoryItem'],
            order: { createdAt: 'DESC' }
        });
    }

    findOne(id: string) {
        return this.ordersRepository.findOne({
            where: { id },
            relations: ['supplier', 'items', 'items.inventoryItem']
        });
    }

    async receiveOrder(id: string) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['items', 'items.inventoryItem']
        });

        if (!order) throw new NotFoundException('Order not found');
        if (order.status === OrderStatus.RECEIVED) return order;

        // Update Inventory
        for (const item of order.items) {
            await this.inventoryService.adjustStock(
                item.inventoryItem.id,
                item.quantity,
                `Received Order #${order.id.slice(0, 8)}`
            );
        }

        order.status = OrderStatus.RECEIVED;
        return this.ordersRepository.save(order);
    }

    async findAllSuppliers() {
        return this.suppliersRepository.find();
    }

    // Helper to seed suppliers if none exist
    async seedSuppliers() {
        const count = await this.suppliersRepository.count();
        if (count === 0) {
            await this.suppliersRepository.save([
                { name: 'AutoParts Co.', email: 'sales@autoparts.com', phone: '555-0101' },
                { name: 'Global Tires', email: 'orders@globaltires.com', phone: '555-0102' },
                { name: 'Oil & Lube Supply', email: 'contact@oillube.com', phone: '555-0103' },
            ]);
        }
    }
}
