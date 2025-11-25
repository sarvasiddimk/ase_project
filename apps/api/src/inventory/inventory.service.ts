import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from './dto/inventory-item.dto';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(InventoryItem)
        private inventoryRepository: Repository<InventoryItem>,
    ) { }

    create(createInventoryItemDto: CreateInventoryItemDto): Promise<InventoryItem> {
        const item = this.inventoryRepository.create(createInventoryItemDto);
        return this.inventoryRepository.save(item);
    }

    findAll(): Promise<InventoryItem[]> {
        return this.inventoryRepository.find({ order: { name: 'ASC' } });
    }

    async findOne(id: string): Promise<InventoryItem> {
        const item = await this.inventoryRepository.findOneBy({ id });
        if (!item) {
            throw new NotFoundException(`Inventory item with ID ${id} not found`);
        }
        return item;
    }

    async update(id: string, updateInventoryItemDto: UpdateInventoryItemDto): Promise<InventoryItem> {
        const item = await this.findOne(id);
        Object.assign(item, updateInventoryItemDto);
        return this.inventoryRepository.save(item);
    }

    async remove(id: string): Promise<void> {
        const result = await this.inventoryRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Inventory item with ID ${id} not found`);
        }
    }

    async adjustStock(id: string, quantity: number, reason: string): Promise<InventoryItem> {
        const item = await this.findOne(id);
        const newQuantity = item.quantityOnHand + quantity;

        if (newQuantity < 0) {
            throw new BadRequestException(`Insufficient stock. Current: ${item.quantityOnHand}, Requested deduction: ${Math.abs(quantity)}`);
        }

        item.quantityOnHand = newQuantity;
        // In a real app, we would log the transaction/reason here
        return this.inventoryRepository.save(item);
    }
}
