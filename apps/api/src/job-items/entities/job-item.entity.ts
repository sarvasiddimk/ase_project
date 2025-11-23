import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ServiceJob } from '../../service-jobs/entities/service-job.entity';

export enum JobItemType {
    PART = 'PART',
    LABOR = 'LABOR',
}

@Entity()
export class JobItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'simple-enum',
        enum: JobItemType,
    })
    type: JobItemType;

    @Column()
    description: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;

    @ManyToOne(() => ServiceJob, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'serviceJobId' })
    serviceJob: ServiceJob;

    @Column()
    serviceJobId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
