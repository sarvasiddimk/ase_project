import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ServiceJob } from '../../service-jobs/entities/service-job.entity';

export enum InvoiceStatus {
    DRAFT = 'DRAFT',
    ISSUED = 'ISSUED',
    PAID = 'PAID',
    VOID = 'VOID',
}

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    invoiceNumber: string;

    @Column({ type: 'timestamp', nullable: true })
    issuedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    dueDate: Date;

    @Column({
        type: 'simple-enum',
        enum: InvoiceStatus,
        default: InvoiceStatus.DRAFT,
    })
    status: InvoiceStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    taxAmount: number;

    @Column({ type: 'simple-json' })
    lineItems: Record<string, any>[];

    @OneToOne(() => ServiceJob, (job) => job.invoice)
    @JoinColumn()
    job: ServiceJob;

    @Column()
    jobId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
