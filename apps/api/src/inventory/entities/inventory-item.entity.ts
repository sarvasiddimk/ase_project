import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  quantityOnHand: number;

  @Column({ type: 'int', default: 5 })
  reorderLevel: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sellPrice: number;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
