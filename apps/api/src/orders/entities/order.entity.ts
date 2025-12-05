import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Supplier } from './supplier.entity';
import { InventoryItem } from '../../inventory/entities/inventory-item.entity';

export enum OrderStatus {
    DRAFT = 'DRAFT',
    ORDERED = 'ORDERED',
    RECEIVED = 'RECEIVED',
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'simple-enum',
        enum: OrderStatus,
        default: OrderStatus.DRAFT,
    })
    status: OrderStatus;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Supplier, (supplier) => supplier.orders)
    supplier: Supplier;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];
}

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    costPrice: number;

    @ManyToOne(() => Order, (order) => order.items)
    order: Order;

    @ManyToOne(() => InventoryItem)
    inventoryItem: InventoryItem;
}
