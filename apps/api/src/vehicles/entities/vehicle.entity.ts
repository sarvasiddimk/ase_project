import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    vin: string;

    @Column()
    make: string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column({ nullable: true })
    telematicsId: string;

    @ManyToOne(() => Customer, (customer) => customer.vehicles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @Column()
    customerId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
