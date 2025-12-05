import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class BusinessProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 'Red Panther Auto' })
    name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    website: string;

    @Column({ type: 'text', nullable: true })
    logo: string; // Base64 string for simplicity

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
