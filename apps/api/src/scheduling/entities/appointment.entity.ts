import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { ServiceJob } from '../../service-jobs/entities/service-job.entity';

export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @Column()
    customerId: string;

    @ManyToOne(() => Vehicle, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vehicleId' })
    vehicle: Vehicle;

    @Column()
    vehicleId: string;

    @ManyToOne(() => ServiceJob, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'serviceJobId' })
    serviceJob: ServiceJob;

    @Column({ nullable: true })
    serviceJobId: string;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp' })
    endTime: Date;

    @Column({
        type: 'simple-enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.SCHEDULED,
    })
    status: AppointmentStatus;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
