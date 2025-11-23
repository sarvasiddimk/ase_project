import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Customer } from '../../customers/entities/customer.entity';

export enum JobStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    PAID = 'PAID',
}

@Entity()
export class ServiceJob {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'simple-enum',
        enum: JobStatus,
        default: JobStatus.PENDING,
    })
    status: JobStatus;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => Vehicle, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vehicleId' })
    vehicle: Vehicle;

    @Column()
    vehicleId: string;

    @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @Column()
    customerId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
