import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { JobItem } from '../../job-items/entities/job-item.entity';

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

  @OneToOne(() => Invoice, (invoice) => invoice.job, { nullable: true })
  @JoinColumn()
  invoice: Invoice;

  @Column({ nullable: true })
  invoiceId: string;

  @OneToMany(() => JobItem, (jobItem) => jobItem.serviceJob)
  items: JobItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
